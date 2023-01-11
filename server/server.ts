import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { DISCORD_TOKEN_URL, DISCORD_USER_URL } from "./CONSTANTS";
import { createLobbyCode, handleResponseErrors } from "./utils";
import { URLSearchParams } from "url";
import fetch from "node-fetch";
import { DiscordUser, GameState } from "./interfaces";

dotenv.config();

const gameStates = {} as GameState;
const users = {} as DiscordUser;

const getDefaultGameState = (numPlayers: number, userID: string) => {
	return { playerIDs: [userID], maxPlayers: numPlayers };
}

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});

io.on("connection", socket => {
	socket.on('validateUser', async (code, callback) => {
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
	});

	socket.on("createLobby", (numPlayers, userID, callback) => {
		let allLobbyCodes = Object.keys(gameStates);
		let lobbyCode = createLobbyCode(5);
		while (allLobbyCodes.includes(lobbyCode)) {
			lobbyCode = createLobbyCode(5);
		}
		let gameState = getDefaultGameState(numPlayers, userID);
		gameStates[lobbyCode] = gameState;
		socket.join(lobbyCode);
		callback(lobbyCode);
	});

	socket.on("joinLobby", (code, userID, callback) => {
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
			gameState.playerIDs.push(userID);
		}
		callback(status);
	});
});