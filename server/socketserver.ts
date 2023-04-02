import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { createLobbyCode } from "./utils";
import { SocketCodes } from "./interfaces";
import { Player } from "../src/game/Player";
import { Game } from "../src/game/Game";
import { Card } from "../src/game/Cards";
import { Lobby } from "../src/game/Lobby";

dotenv.config();

const gameStates = {} as Record<string, Game>;
const lobbies = {} as Record<string, Lobby>;
const socketCodes = {} as SocketCodes;

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});

io.on("connection", socket => {
	const createLobby = (userID: string, callback: Function) => {
		const allLobbyCodes = Object.keys(gameStates);
		let lobbyCode = createLobbyCode(5);
		while (allLobbyCodes.includes(lobbyCode)) {
			lobbyCode = createLobbyCode(5);
		}
		const lobby = new Lobby([userID]);
		lobbies[lobbyCode] = lobby;
		socket.join(lobbyCode);
		socketCodes[socket.id] = { userID, lobbyCode };
		io.in(lobbyCode).emit("updateLobby", { playerIDs: lobby.playerIDs });
		callback(lobbyCode);
	}

	const joinLobby = (code: string, userID: string, callback: Function) => {
		let status = "OK";

		if (!Object.keys(lobbies).includes(code)) {
			status = "Invalid code";
			return callback(status);
		};

		let lobby = lobbies[code];
		if (lobby.playerIDs.length === lobby.maxPlayers) {
			status = "Lobby full";
		} else if (!lobby.playerIDs.includes(userID)) {
			socket.join(code);
			socketCodes[socket.id] = { userID, lobbyCode: code };
			lobby.playerIDs.push(userID);
			io.in(code).emit("updateLobby", { playerIDs: lobby.playerIDs });
		}
		callback(status);
	}

	const startGame = () => {
		const { lobbyCode } = socketCodes[socket.id];
		const lobby = lobbies[lobbyCode];

		const players = lobby.playerIDs.map(id => new Player(id));

		const game = new Game(players);
		const { turn, round, phase, status } = game;
		gameStates[lobbyCode] = game;

		const clients = io.sockets.adapter.rooms.get(lobbyCode);
		clients?.forEach(clientID => {
			const clientSocket = io.sockets.sockets.get(clientID);
			const { userID } = socketCodes[clientID];
			clientSocket?.emit("updateGame", { 
				player: players.find(p => p.id === userID),
				turn,
				round,
				status,
				phase
			});
		});
	}

	const keepCard = (card: Card, idx: number) => {
		const { lobbyCode, userID } = socketCodes[socket.id];
		const game = gameStates[lobbyCode];

		const clientSenderSocket = io.sockets.sockets.get(socket.id);
		const clients = io.sockets.adapter.rooms.get(lobbyCode);

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

			const clients = io.sockets.adapter.rooms.get(lobbyCode);
			clients?.forEach(clientID => {
				const clientSocket = io.sockets.sockets.get(clientID);
				const { userID } = socketCodes[clientID];
				const { players, turn, round, phase } = game;

				clientSocket?.emit("updateGame", { 
					player: players.find(p => p.id === userID),
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

	socket.on("createLobby", createLobby);
	socket.on("joinLobby", joinLobby);
	socket.on("startGame", startGame);
	socket.on("keepCard", keepCard);
	socket.on("keepSecondCard", keepSecondCard);
});