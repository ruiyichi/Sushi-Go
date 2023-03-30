import { createContext, useContext, useReducer, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Player } from "../game/Player";
import { Card } from "../game/Cards";

const SushiGoContext = createContext({} as SushiGoInterface);

interface User {
	auth: boolean,
	username: string,
	id: string,
	accessToken: string,
};

interface ProtectedPlayer {
	id: string,
	keptHand: Card[],
	score: number,
};

interface SushiGoInterface { 
	game: Game,
	updateGame: React.Dispatch<any>,
	socket: Socket,
	user: User,
	updateUser: React.Dispatch<any>,
	clearUser: React.Dispatch<any>,
	persist: string,
	setPersist: React.Dispatch<any>,
};

interface Game {
	code: string,
	playerIDs: string[],
	maxPlayers: number,
	status: "In lobby" | "In progress" | "Completed",
	player: null | Player,
	players: ProtectedPlayer[],
	turn: number,
	round: number,
	phase: string,
};

type Action = { type: 'update', payload: User } | { type: 'clear'};

const defaultGameState = {
	code: '', 
	playerIDs: [], 
	maxPlayers: 0,
	status: "In lobby",
	player: null,
	players: [],
	turn: 0,
	round: 0,
	phase: "",
} as Game;

const socket = io("http://localhost:3001");

export const SushiGoProvider = ({ children }: { children: React.ReactNode }) => {
	socket.on("updateGame", params => updateGame(params as Game));

	const gameReducer = (game: Game, payload: Game) => {
		return { ...game, ...payload };
	}
	const [game, updateGame] = useReducer(gameReducer, defaultGameState);

	const userReducer: React.Reducer<User, Action> = (user: User, action: Action) => {
		switch (action.type) {
			case 'update':
				return { ...user, ...action.payload };
			case 'clear':
				return {} as User;
			default:
				return user;
		}
	}
	const [user, dispatch] = useReducer(userReducer, {} as User);

	const updateUser = (payload: User) => {
		dispatch({ type: 'update', payload });
	}

	const clearUser = () => {
		dispatch({ type: 'clear' });
	}

	const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist') || 'false') || false);

	const value: SushiGoInterface = { 
		game,
		updateGame,
		socket,
		user,
		updateUser,
		clearUser,
		persist,
		setPersist,
	};

	return (
		<SushiGoContext.Provider value={value}>
			{children}
		</SushiGoContext.Provider>
	);
}

export const useSushiGo = () => useContext(SushiGoContext);