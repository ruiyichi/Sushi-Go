import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { DISCORD_TOKEN_URL, DISCORD_USER_URL } from "./CONSTANTS";
import { handleResponseErrors } from "./utils";
import { URLSearchParams } from "url";
import fetch from "node-fetch";

dotenv.config();

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
		}
		callback(discordUserResJSON);
	})
});