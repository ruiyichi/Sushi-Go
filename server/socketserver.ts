import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { createLobbyCode } from "./utils";
import { GameState, SocketCodes } from "./interfaces";
import { Player } from "../src/game/Player";
import { Game } from "../src/game/Game";
import { Card } from "../src/game/Cards";

dotenv.config();

const gameStates = {} as Record<string, GameState>;
const socketCodes = {} as SocketCodes;

const getDefaultGameState = (numPlayers: number, userID: string): GameState => {
	return { 
		playerIDs: [userID],
		maxPlayers: numPlayers,
		status: "In lobby",
		players: [],
		game: new Game(),
		phase: "",
	};
}

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});

io.on("connection", socket => {
	const createLobby = (numPlayers: number, userID: string, callback: Function) => {
		let allLobbyCodes = Object.keys(gameStates);
		let lobbyCode = createLobbyCode(5);
		while (allLobbyCodes.includes(lobbyCode)) {
			lobbyCode = createLobbyCode(5);
		}
		let gameState = getDefaultGameState(numPlayers, userID);
		gameStates[lobbyCode] = gameState;
		socket.join(lobbyCode);
		socketCodes[socket.id] = { userID, lobbyCode };
		io.in(lobbyCode).emit("updateGame", { playerIDs: gameState.playerIDs });
		callback(lobbyCode);
	}

	const joinLobby = (code: string, userID: string, callback: Function) => {
		let status = "OK";

		if (!Object.keys(gameStates).includes(code)) {
			status = "Invalid code";
			return callback(status);
		};

		let gameState = gameStates[code];
		if (gameState.playerIDs.length === gameState.maxPlayers) {
			status = "Lobby full";
		} else if (!gameState.playerIDs.includes(userID)) {
			socket.join(code);
			socketCodes[socket.id] = { userID, lobbyCode: code };
			gameState.playerIDs.push(userID);
			io.in(code).emit("updateGame", { playerIDs: gameState.playerIDs });
		}
		callback(status, gameState.maxPlayers);
	}

	const startGame = () => {
		const { lobbyCode } = socketCodes[socket.id];
		const gameState = gameStates[lobbyCode];

		gameState.status = "In progress";
		gameState.playerIDs.forEach(id => gameState.players.push(new Player(id)));

		const game = new Game(gameState.players);
		const { turn, round, players, phase } = game;
		gameState.game = game;

		const clients = io.sockets.adapter.rooms.get(lobbyCode);
		clients?.forEach(clientID => {
			const clientSocket = io.sockets.sockets.get(clientID);
			const { userID } = socketCodes[clientID];
			clientSocket?.emit("updateGame", { 
				player: players.find(player => player.id === userID),
				turn,
				round,
				status: gameState.status,
				phase
			});
		});
	}

	const keepCard = (card: Card, idx: number) => {
		const { lobbyCode, userID } = socketCodes[socket.id];
		const gameState = gameStates[lobbyCode];

		const clientSenderSocket = io.sockets.sockets.get(socket.id);
		const clients = io.sockets.adapter.rooms.get(lobbyCode);

		if (gameState.playerIDs.includes(userID)) {
			let player = gameState.players.find(p => p.id === userID);

			if (player && !player.keptCard) {
				let cardOnServer = player.hand[idx];

				if (cardOnServer.name === card.name) {
					player.keepCard(cardOnServer);
					gameState.game.updatePhase();

					clientSenderSocket?.emit("updateGame", { player });

					clients?.forEach(clientID => {
						const clientSocket = io.sockets.sockets.get(clientID);
						clientSocket?.emit("updateGame", { phase: gameState.game.phase });
					});
				}
			}
		}

		if (gameState.players.every(p => p.keptCard)) {
			if (gameState.game.turn < gameState.game.maxTurns) {
				gameState.game.nextTurn();
			} else if (gameState.game.round < gameState.game.maxRounds) {
				gameState.game.nextRound();
			} else if (gameState.game.round === gameState.game.maxRounds) {
				gameState.game.finalRound();
			}

			gameState.game.updatePhase();

			const clients = io.sockets.adapter.rooms.get(lobbyCode);
			clients?.forEach(clientID => {
				const clientSocket = io.sockets.sockets.get(clientID);
				const { userID } = socketCodes[clientID];
				const { players, turn, round, phase } = gameState.game;

				clientSocket?.emit("updateGame", { 
					player: players.find(player => player.id === userID),
					players: players.filter(p => p.id !== userID).map(p => ({
						id: p.id,
						score: p.score,
						keptHand: p.keptHand
					})),
					turn,
					round,
					phase
				});
			});
		}
	}

	const keepSecondCard = (card: Card, idx: number) => {
		const { lobbyCode, userID } = socketCodes[socket.id];
		const gameState = gameStates[lobbyCode];

		const clientSenderSocket = io.sockets.sockets.get(socket.id);

		if (gameState.playerIDs.includes(userID)) {
			let player = gameState.players.find(p => p.id === userID);

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
	}

	socket.on("createLobby", createLobby);
	socket.on("joinLobby", joinLobby);
	socket.on("startGame", startGame);
	socket.on("keepCard", keepCard);
	socket.on("keepSecondCard", keepSecondCard);
});