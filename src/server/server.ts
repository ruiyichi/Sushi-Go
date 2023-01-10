import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { DISCORD_TOKEN_URL } from "./CONSTANTS";
import { handleResponseErrors } from "./utils";
import { URLSearchParams } from "url";
import fetch from "node-fetch";

dotenv.config();

const io = new Server(3001, { cors: { origin: "http://localhost:3000" }});

io.on("connection", socket => {
	socket.on('validateUser', async (code, callback) => {
		let response = await fetch(DISCORD_TOKEN_URL, {
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
		let responseJSON = await handleResponseErrors(response);
		console.log(responseJSON)

		if (!responseJSON) return;
	})
});