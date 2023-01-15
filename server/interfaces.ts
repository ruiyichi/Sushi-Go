export interface Room {
	[key: string]: string
}

export interface GameStates {
	[code: string]: GameState
}

export interface GameState {
	playerIDs: string[],
	maxPlayers: number,
	status: "In lobby" | "In progress" | "Completed"
}

export interface SocketCodes {
	[id: string]: string 
}

export interface DiscordUser {
  [id: string]: {
    username: string,
  },
}