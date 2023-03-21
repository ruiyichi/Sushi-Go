import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { DISCORD_TOKEN_URL, DISCORD_USER_URL } from "./CONSTANTS";
import { createLobbyCode, handleResponseErrors } from "./utils";
import { URLSearchParams } from "url";
import fetch from "node-fetch";
import { DiscordUser, GameState, GameStates, SocketCodes } from "./interfaces";
import { Player } from "../src/game/Player";
import { Game } from "../src/game/Game";
import { Card } from "../src/game/Cards";

dotenv.config();

const gameStates = {} as GameStates;
const users = {} as DiscordUser;
const socketCodes = {} as SocketCodes;

const getDefaultGameState = (numPlayers: number, userID: string): GameState => {
	return { 
		playerIDs: [userID],
		maxPlayers: numPlayers,
		status: "In lobby",
		players: [],
		game: new Game(),
	};
}

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});

const validateUser = async (code: string, callback: Function) => {
	let discordTokenRes = await fetch(DISCORD_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: process.env.CLIENT_ID || '',
			client_secret: process.env.CLIENT_SECRET || '',
			grant_type: 'authorization_code',
			code,
			redirect_uri: 'http://localhost:3000/auth'
		})
	})
	let discordTokenResJSON = await handleResponseErrors(discordTokenRes);
	let discordUserResJSON;
	
	if (discordTokenResJSON) {
		let { token_type, access_token } = discordTokenResJSON;
		let discordUserRes = await fetch(DISCORD_USER_URL, { 
			headers: { 
				authorization: `${token_type} ${access_token}` 
			} 
		});
		discordUserResJSON = await handleResponseErrors(discordUserRes);
		if (discordUserResJSON) {
			let { username, id } = discordUserResJSON;
			users[id] = { username };
		}
	}
	callback(discordUserResJSON);
};

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
		}
		else if (!gameState.playerIDs.includes(userID)) {
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
		const { turn, round, players } = game;
		gameState.game = game;

		const clients = io.sockets.adapter.rooms.get(lobbyCode);
		clients?.forEach(clientID => {
			const clientSocket = io.sockets.sockets.get(clientID);
			const { userID } = socketCodes[clientID];
			clientSocket?.emit("updateGame", { 
				player: players.find(player => player.id === userID),
				turn,
				round,
				status: gameState.status
			});
		});
	}

	const keepCard = (card: Card, idx: number) => {
		const { lobbyCode, userID } = socketCodes[socket.id];
		const gameState = gameStates[lobbyCode];

		const clientSenderSocket = io.sockets.sockets.get(socket.id);

		if (gameState.playerIDs.includes(userID)) {
			let player = gameState.players.find(p => p.id === userID);

			if (player && !player.keptCard) {
				let cardOnServer = player.hand[idx];

				if (cardOnServer.name === card.name) {
					player.keepCard(cardOnServer);

					clientSenderSocket?.emit("updateGame", { player });
				}
			}
		}

		if (gameState.players.every(p => p.keptCard)) {
			if (gameState.game.players.some(p => p.hand.filter(c => c.name === 'Chopsticks').length > 0)) {
				
			}
			else {
				if (gameState.game.turn < gameState.game.maxTurns) {
					gameState.game.nextTurn();
				}
				else if (gameState.game.round < gameState.game.maxRounds) {
					gameState.game.nextRound();
				}
				else if (gameState.game.round === gameState.game.maxRounds) {
					gameState.game.finalRound();
				}
			}

			const clients = io.sockets.adapter.rooms.get(lobbyCode);
			clients?.forEach(clientID => {
				const clientSocket = io.sockets.sockets.get(clientID);
				const { userID } = socketCodes[clientID];
				const { players, turn, round } = gameState.game;

				clientSocket?.emit("updateGame", { 
					player: players.find(player => player.id === userID),
					players: players.filter(p => p.id !== userID).map(p => {
						return ({
							id: p.id,
							score: p.score,
							keptHand: p.keptHand
						});
					}),
					turn,
					round
				});
			});
		}
	}

	socket.on('validateUser', validateUser);
	socket.on("createLobby", createLobby);
	socket.on("joinLobby", joinLobby);
	socket.on("startGame", startGame);
	socket.on("keepCard", keepCard);
});