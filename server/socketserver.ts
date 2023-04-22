import * as dotenv from "dotenv";
import { Socket, Server } from "socket.io";
import { createLobbyCode } from "./utils";
import { Player } from "../src/game/Player";
import { Game } from "../src/game/Game";
import { Card } from "../src/game/Cards";
import { Lobby } from "../src/game/Lobby";
import jwt, { Secret } from 'jsonwebtoken';
import { BasicUser } from "../src/interfaces";
import { SECONDS_PER_ROUND } from "../src/game/Settings";

dotenv.config();

const playerGames = {} as Record<string, Game>;
const playerLobbies = {} as Record<string, Lobby>;
const socketUsers = {} as Record<string, string>;
const intervals = {} as Record<string, NodeJS.Timer>;

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});
console.log("Socket server running on port 3001");

io.use((socket: Socket, next) => {
	if (socket.handshake.query && socket.handshake.query.token) {
		const token = socket.handshake.query.token as string;
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, decoded: any) => {
			if (err) return next(new Error('Authentication error'));
			socketUsers[socket.id] = decoded?.UserInfo?.id;
			next();
		});
	} else {
		next(new Error('Authentication error'));
	}
}).on("connection", socket => {
	// join existing games if disconnected
	const userID = socketUsers[socket.id];
	socket.join(playerGames[userID]?.id);

	const getSocketsByCode = (code: string) => io.sockets.adapter.rooms.get(code);

	const getSocketByID = (id: string) => io.sockets.sockets.get(id);

	const createLobby = (user: BasicUser, callback: Function) => {
		let lobbyCode = createLobbyCode(5);
		while (Object.values(playerLobbies).map(lobby => lobby.code).includes(lobbyCode)) {
			lobbyCode = createLobbyCode(5);
		}
		const lobby = new Lobby(lobbyCode, [user]);
		playerLobbies[userID] = lobby;
		socket.join(lobbyCode);
		io.in(lobbyCode).emit("updateLobby", { ...lobby });
		callback(lobbyCode);
	}

	const joinLobby = (lobbyCode: string, user: BasicUser, callback: Function) => {
		let status = "OK";
		if (!Object.values(playerLobbies).map(lobby => lobby.code).includes(lobbyCode)) {
			status = "Invalid code";
			return callback(status);
		};

		const lobby = Object.values(playerLobbies).find(lobby => lobby.code === lobbyCode) as Lobby;
		const lobbyPlayerIDs = lobby.players.map(p => p.id);

		if (lobbyPlayerIDs.length === lobby.maxPlayers) {
			status = "Lobby full";
		} else if (!lobbyPlayerIDs.includes(user.id)) {
			playerLobbies[user.id] = lobby;
			socket.join(lobbyCode);
			lobby.players.push(user);
			io.in(lobbyCode).emit("updateLobby", { ...lobby });
		}
		callback(status);
	}

	const startGame = () => {
		const hostUserID = socketUsers[socket.id];
		const lobby = playerLobbies[hostUserID];

		const players = lobby.players.map(p => new Player(p.id));
		const game = new Game(players);

		players.forEach(player => playerGames[player.id] = game);

		const lobbyClients = getSocketsByCode(lobby.code);
		lobbyClients?.forEach(clientID => {
			const clientSocket = getSocketByID(clientID);
			const userID = socketUsers[clientID];

			clientSocket?.leave(lobby.code);
			delete playerLobbies[userID];

			clientSocket?.join(game.id);
			clientSocket?.emit("updateGame", { 
				...game,
				player: players.find(p => p.id === userID),
			});
		});

		const gameClients = getSocketsByCode(game.id);
		let counter = SECONDS_PER_ROUND;
		game.setStartTime();
		const countdown = setInterval(() => {
			game.roundStatus = `${counter} seconds remaining`;
			if (counter === 0) {
				clearInterval(countdown);
			}

			gameClients?.forEach(clientID => {
				const clientSocket = getSocketByID(clientID);
				clientSocket?.emit("updateGame", { roundStatus: game.roundStatus } );
			});

			counter--;
		}, 1000);
		intervals[game.id] = countdown;
	}

	const getGame = () => {
		const userID = socketUsers[socket.id];
		const game = playerGames[userID];
		if (!game) return;

		const clientSocket = getSocketByID(socket.id);

		const { players } = game;
		clientSocket?.emit("updateGame", { 
			...game,
			player: players.find(p => p.id === userID),
			players: players.filter(p => p.id !== userID).map(p => ({
				id: p.id,
				score: p.score,
				keptHand: p.keptHand
			})),
		});
	}

	const keepCard = (card: Card, idx: number) => {
		const userID = socketUsers[socket.id];
		const game = playerGames[userID];

		const clientSenderSocket = getSocketByID(socket.id);
		const clients = getSocketsByCode(game.id);

		const player = game.players.find(p => p.id === userID);

		if (player && !player.keptCard) {
			let cardOnServer = player.hand[idx];

			if (cardOnServer.name === card.name && Date.now() - game.startTime <= 30000) {
				player.keepCard(cardOnServer);
				//game.updateRoundStatus();

				clientSenderSocket?.emit("updateGame", { player });

				clients?.forEach(clientID => {
					const clientSocket = getSocketByID(clientID);
					clientSocket?.emit("updateGame", { roundStatus: game.roundStatus });
				});
			}
		}

		if (game.players.every(p => p.keptCard)) {
			clearInterval(intervals[game.id]);
			
			if (game.turn < game.maxTurns) {
				game.nextTurn();
			} else if (game.round < game.maxRounds) {
				game.nextRound();
			} else if (game.round === game.maxRounds) {
				game.finalRound();
			}

			//game.updateRoundStatus();

			const clients = getSocketsByCode(game.id);
			clients?.forEach(clientID => {
				const clientSocket = getSocketByID(clientID);
				const userID = socketUsers[clientID];
				const { players } = game;

				clientSocket?.emit("updateGame", { 
					...game,
					player: players.find(p => p.id === userID),
					players: players.filter(p => p.id !== userID).map(p => ({
						id: p.id,
						score: p.score,
						keptHand: p.keptHand
					})),
				});
			});

			let counter = SECONDS_PER_ROUND;
			game.setStartTime();
			const countdown = setInterval(() => {
				game.roundStatus = `${counter} seconds remaining`;
				if (counter === 0) {
					clearInterval(countdown);
				}

				clients?.forEach(clientID => {
					const clientSocket = getSocketByID(clientID);
					clientSocket?.emit("updateGame", { roundStatus: game.roundStatus } );
				});

				counter--;
			}, 1000);
			intervals[game.id] = countdown;
		}
	}

	const keepSecondCard = (card: Card, idx: number) => {
		const userID = socketUsers[socket.id];
		const gameState = playerGames[userID];
		const clientSenderSocket = getSocketByID(socket.id);
		const player = gameState.players.find(p => p.id === userID);

		if (player) {
			const cardOnServer = player.hand[idx];

			if (player.hadChopsticks && player.keptHand.some(card => card.name === 'Chopsticks') && cardOnServer.name === card.name) {
				player.keepCard(cardOnServer);
				const chopsticks = player.keptHand.find(card => card.name === 'Chopsticks');
				if (chopsticks) {
					player.hand.push(chopsticks);
					player.keptHand.splice(player.keptHand.indexOf(chopsticks), 1);
				}
				player.hadChopsticks = false;

				clientSenderSocket?.emit("updateGame", { player });
			}
		}
	}

	const handleDisconnect = () => {
		console.log(`Disconnecting ${socket.id}`);
		delete socketUsers[socket.id];
	}

	socket.on("createLobby", createLobby);
	socket.on("joinLobby", joinLobby);
	socket.on("startGame", startGame);
	socket.on("getGame", getGame);
	socket.on("keepCard", keepCard);
	socket.on("keepSecondCard", keepSecondCard);

	socket.on("disconnect", handleDisconnect);
});