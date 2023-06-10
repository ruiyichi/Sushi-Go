import * as dotenv from "dotenv";
import { Socket, Server } from "socket.io";
import { createLobbyCode } from "./utils";
import { Player } from "../src/game/Player";
import { Game } from "../src/game/Game";
import { Card } from "../src/game/Cards";
import { Lobby } from "../src/game/Lobby";
import jwt, { Secret } from 'jsonwebtoken';
import { BasicUser } from "../src/interfaces";
import { MS_PER_ROUND } from "../src/game/Settings";
import { MAX_ITER } from "./CONSTANTS";

dotenv.config();

const playerGames = {} as Record<string, Game>;
const playerLobbies = {} as Record<string, Lobby>;
const socketUsers = {} as Record<string, string>;
const roundTimers = {} as Record<string, NodeJS.Timer>;

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
	console.log(`Connected ${userID}`)

	const getSocketsByCode = (code: string) => io.sockets.adapter.rooms.get(code);

	const getSocketByID = (id: string) => io.sockets.sockets.get(id);

	const createRoundTimer = (game: Game) => {
		let counter = MS_PER_ROUND;
		game.setTurnStartTime();

		const updateClientRoundTimer = () => {
			game.turnTimer = counter;
			if (counter === 0) {
				clearInterval(timer);
				autopickPlayerCards(game);
				handleEndTurn(game);
			}

			counter -= 100;
		}

		updateClientRoundTimer();  // call immediately first time without delay
		const timer = setInterval(updateClientRoundTimer, 100);
		roundTimers[game.id] = timer;
	}

	const autopickPlayerCards = (game: Game) => {
		game.players.forEach(player => {
			if (!player.keptCard) {
				player.keepCard(player.hand[0]);
			}
		});

		emitUpdatedGameToAllClients(game);
	}

	const emitUpdatedGameToAllClients = (game: Game) => {
		const clients = getSocketsByCode(game.id);
		clients?.forEach(clientID => emitUpdatedGameToClient(game, clientID));
	}

	const emitUpdatedGameToClient = (game: Game, clientSocketID: string) => {
		const { players } = game;
		const clientSocket = getSocketByID(clientSocketID);
		const userID = socketUsers[clientSocketID];

		clientSocket?.emit("updateGame", { 
			...game,
			player: players.find(p => p.id === userID),
			opponents: players.filter(p => p.id !== userID).map(p => ({
				id: p.id,
				username: p.username,
				score: p.score,
				keptCards: p.keptCards
			})),
		});
		clientSocket?.emit("setTurnTimer", game.turnTimer);
	}

	const createLobby = (user: BasicUser, callback: Function) => {
		let lobbyCode = createLobbyCode(5);
		let iterations = 0;
		while (Object.values(playerLobbies).map(lobby => lobby.code).includes(lobbyCode) && iterations < MAX_ITER) {
			lobbyCode = createLobbyCode(5);
			iterations++;
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

		const players = lobby.players.map(p => new Player(p.id, p.username));
		const game = new Game(players);

		players.forEach(player => playerGames[player.id] = game);

		const lobbyClients = getSocketsByCode(lobby.code);
		lobbyClients?.forEach(clientID => {
			const clientSocket = getSocketByID(clientID);
			const userID = socketUsers[clientID];
			clientSocket?.leave(lobby.code);
			delete playerLobbies[userID];
			clientSocket?.join(game.id);
		});
		
		createRoundTimer(game);
		emitUpdatedGameToAllClients(game);
	}

	const emitExistingGame = () => {
		const userID = socketUsers[socket.id];
		const game = playerGames[userID];
		if (!game) return;

		emitUpdatedGameToClient(game, socket.id);
	}
	
	const emitTurnTimer = () => {
		const userID = socketUsers[socket.id];
		const game = playerGames[userID];
		if (!game) return;
		
		const clientSocket = getSocketByID(socket.id);
		clientSocket?.emit("setTurnTimer", game.turnTimer);
	} 

	const handleEndTurn = (game: Game) => {
		clearInterval(roundTimers[game.id]);
			
		if (game.turn < game.maxTurns) {
			game.nextTurn();
		} else if (game.round < game.maxRounds) {
			game.nextRound();
		} else if (game.round === game.maxRounds) {
			game.finalRound();
		}

		if (game.status !== 'Completed') {
			createRoundTimer(game);
		}

		emitUpdatedGameToAllClients(game);
	}

	const keepCard = (card: Card, idx: number) => {
		const userID = socketUsers[socket.id];
		const game = playerGames[userID];

		const clientSenderSocket = getSocketByID(socket.id);

		const player = game.players.find(p => p.id === userID);

		if (player && !player.keptCard) {
			let cardOnServer = player.hand[idx];

			if (cardOnServer.name === card.name && Date.now() - game.turnStartTime <= MS_PER_ROUND) {
				player.keepCard(cardOnServer);

				clientSenderSocket?.emit("updateGame", { player });
			}
		}

		if (game.players.every(p => p.keptCard)) {
			handleEndTurn(game);
		}
	}

	const keepSecondCard = (card: Card, idx: number) => {
		const userID = socketUsers[socket.id];
		const gameState = playerGames[userID];
		const player = gameState.players.find(p => p.id === userID);

		if (player) {
			const cardOnServer = player.hand[idx];

			if (player.hadChopsticks && player.keptCards.some(card => card.name === 'Chopsticks') && cardOnServer.name === card.name) {
				player.keepCard(cardOnServer);
				const chopsticks = player.keptCards.find(card => card.name === 'Chopsticks');
				if (chopsticks) {
					player.hand.push(chopsticks);
					player.keptCards.splice(player.keptCards.indexOf(chopsticks), 1);
				}
				player.hadChopsticks = false;

				const clientSenderSocket = getSocketByID(socket.id);
				clientSenderSocket?.emit("updateGame", { player });
			}
		}
	}

	const handleDisconnect = () => {
		console.log(`Disconnected ${socketUsers[socket.id]}`);
		delete socketUsers[socket.id];
	}

	socket.on("createLobby", createLobby);
	socket.on("joinLobby", joinLobby);
	socket.on("startGame", startGame);
	socket.on("keepCard", keepCard);
	socket.on("getTurnTimer", emitTurnTimer)
	socket.on("keepSecondCard", keepSecondCard);
	socket.on("disconnect", handleDisconnect);
	
	// Send on connect
	emitExistingGame();
});