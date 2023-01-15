import { createContext, useContext, useReducer } from "react";
import { io, Socket } from "socket.io-client";

const SushiGoContext = createContext({} as SushiGoInterface);

interface User {
	auth: boolean,
	username: string,
	id: string
};

interface SushiGoInterface { 
	game: Game,
	updateGame: React.Dispatch<any>,
	socket: Socket,
	user: User,
	updateUser: React.Dispatch<any>
};

interface Game {
	code: string,
	playerIDs: string[],
	maxPlayers: number,
	status: "In lobby" | "In progress" | "Completed"
};

const defaultGameState = {
	code: '', 
	playerIDs: [], 
	maxPlayers: 0,
	status: "In lobby"
} as Game;

const socket = io("http://localhost:3001");

export const SushiGoProvider = ({ children }: { children: React.ReactNode }) => {
	socket.on("playerIDs", playerIDs => updateGame({ playerIDs } as Game));
	socket.on("startGame", () => updateGame({ status: "In progress" } as Game));
	
	const gameReducer = (game: Game, payload: Game) => {
		return { ...game, ...payload };
	}
	const [game, updateGame] = useReducer(gameReducer, defaultGameState);

	const userReducer = (user: User, payload: User) => {
		return { ...user, ...payload };
	}
	const [user, updateUser] = useReducer(userReducer, { auth: false } as User);

	const value: SushiGoInterface = { 
		game,
		updateGame,
		socket,
		user,
		updateUser,
	};

	return (
		<SushiGoContext.Provider value={value}>
			{children}
		</SushiGoContext.Provider>
	);
}

export const useSushiGo = () => useContext(SushiGoContext);