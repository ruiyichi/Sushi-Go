import * as dotenv from "dotenv";
import { Socket, Server } from "socket.io";
import { createLobbyCode } from "./utils";
import { Player } from "../src/game/Player";
import { Game } from "../src/game/Game";
import { Card } from "../src/game/Cards";
import { Lobby } from "../src/game/Lobby";
import jwt, { Secret } from 'jsonwebtoken';

dotenv.config();

const playerGames = {} as Record<string, Game>;
const playerLobbies = {} as Record<string, Lobby>;
const socketUsers = {} as Record<string, string>;

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});

io.use((socket: Socket, next) => {
	if (socket.handshake.query && socket.handshake.query.token) {
		const token = socket.handshake.query.token as string;
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, decoded: any) => {
			if (err) return next(new Error('Authentication error'));
			socketUsers[socket.id] = decoded?.UserInfo?.username;
			next();
		});
	} else {
		next(new Error('Authentication error'));
	}
}).on("connection", socket => {
	// join existing games if disconnected
	const userID = socketUsers[socket.id];
	socket.join(playerGames[userID]?.id);

	const createLobby = (userID: string, callback: Function) => {
		let lobbyCode = createLobbyCode(5);
		while (Object.values(playerLobbies).map(lobby => lobby.code).includes(lobbyCode)) {
			lobbyCode = createLobbyCode(5);
		}
		const lobby = new Lobby(lobbyCode, [userID]);
		playerLobbies[userID] = lobby;
		socket.join(lobbyCode);
		io.in(lobbyCode).emit("updateLobby", { ...lobby });
		callback(lobbyCode);
	}

	const joinLobby = (lobbyCode: string, userID: string, callback: Function) => {
		let status = "OK";
		if (!Object.values(playerLobbies).map(lobby => lobby.code).includes(lobbyCode)) {
			status = "Invalid code";
			return callback(status);
		};

		const lobby = Object.values(playerLobbies).find(lobby => lobby.code === lobbyCode) as Lobby;
		if (lobby.playerIDs.length === lobby.maxPlayers) {
			status = "Lobby full";
		} else if (!lobby.playerIDs.includes(userID)) {
			playerLobbies[userID] = lobby;
			socket.join(lobbyCode);
			lobby.playerIDs.push(userID);
			io.in(lobbyCode).emit("updateLobby", { ...lobby });
		}
		callback(status);
	}

	const startGame = () => {
		const hostUserID = socketUsers[socket.id];
		const { playerIDs, code } = playerLobbies[hostUserID];

		const players = playerIDs.map(id => new Player(id));
		const game = new Game(players);

		players.forEach(player => playerGames[player.id] = game);

		const clients = io.sockets.adapter.rooms.get(code);
		clients?.forEach(clientID => {
			const clientSocket = io.sockets.sockets.get(clientID);
			const userID = socketUsers[clientID];

			clientSocket?.leave(code);
			delete playerLobbies[userID];

			clientSocket?.join(game.id);
			clientSocket?.emit("updateGame", { 
				...game,
				player: players.find(p => p.id === userID),
			});
		});
	}

	const getGame = () => {
		const userID = socketUsers[socket.id];
		const game = playerGames[userID];
		if (!game) return;

		const clientSocket = io.sockets.sockets.get(socket.id);

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

		const clientSenderSocket = io.sockets.sockets.get(socket.id);
		const clients = io.sockets.adapter.rooms.get(game.id);

		const player = game.players.find(p => p.id === userID);

		if (player && !player.keptCard) {
			let cardOnServer = player.hand[idx];

			if (cardOnServer.name === card.name) {
				player.keepCard(cardOnServer);
				game.updatePhase();

				clientSenderSocket?.emit("updateGame", { player });

				clients?.forEach(clientID => {
					const clientSocket = io.sockets.sockets.get(clientID);
					clientSocket?.emit("updateGame", { phase: game.phase });
				});
			}
		}

		if (game.players.every(p => p.keptCard)) {
			if (game.turn < game.maxTurns) {
				game.nextTurn();
			} else if (game.round < game.maxRounds) {
				game.nextRound();
			} else if (game.round === game.maxRounds) {
				game.finalRound();
			}

			game.updatePhase();

			const clients = io.sockets.adapter.rooms.get(game.id);
			clients?.forEach(clientID => {
				const clientSocket = io.sockets.sockets.get(clientID);
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
		}
	}

	const keepSecondCard = (card: Card, idx: number) => {
		const userID = socketUsers[socket.id];
		const gameState = playerGames[userID];
		const clientSenderSocket = io.sockets.sockets.get(socket.id);
		const player = gameState.players.find(p => p.id === userID);

		if (player) {
			let cardOnServer = player.hand[idx];

			if (player.hadChopsticks && player.keptHand.some(card => card.name === 'Chopsticks') && cardOnServer.name === card.name) {
				player.keepCard(cardOnServer);
				let chopsticks = player.keptHand.find(card => card.name === 'Chopsticks');
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