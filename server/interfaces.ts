export interface Room {
	[key: string]: string
}

export interface GameState {
	[code: string]: { 
		playerIDs: string[],
		maxPlayers: number,
	},
}

export interface DiscordUser {
  [id: string]: {
    username: string,
  },
}