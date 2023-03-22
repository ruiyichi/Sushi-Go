import { Game } from "../src/game/Game";
import { Player } from "../src/game/Player";

export interface GameState {
	playerIDs: string[],
	maxPlayers: number,
	status: "In lobby" | "In progress" | "Completed",
	players: Player[],
	game: Game,
	phase: string
}

export interface SocketCodes {
	[id: string]: { 
		lobbyCode: string,
		userID: string
	}
}