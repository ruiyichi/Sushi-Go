import { Game } from "../src/game/Game";
import { Player } from "../src/game/Player";

export interface Room {
	[key: string]: string
}

export interface GameStates {
	[code: string]: GameState
}

export interface GameState {
	playerIDs: string[],
	maxPlayers: number,
	status: "In lobby" | "In progress" | "Completed",
	players: Player[],
	game: null | Game
}

export interface SocketCodes {
	[id: string]: { 
		lobbyCode: string,
		userID: string
	}
}

export interface DiscordUser {
  [id: string]: {
    username: string,
  },
}