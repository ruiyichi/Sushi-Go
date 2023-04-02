import { createContext, useContext, useReducer, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Player } from "../game/Player";
import { Card } from "../game/Cards";
import { Lobby } from "../game/Lobby";

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
	lobby: Lobby,
	updateLobby: React.Dispatch<any>
};

interface Game {
	status: "In lobby" | "In progress" | "Completed",
	player: null | Player,
	players: ProtectedPlayer[],
	turn: number,
	round: number,
	phase: string,
};

type UserAction = { type: 'update', payload: User } | { type: 'clear'};
interface LobbyAction { 
	type: 'update', 
	payload: Lobby 
};

const defaultGameState = {
	status: "In lobby",
	player: null,
	players: [],
	turn: 0,
	round: 0,
	phase: "",
} as Game;

const socket = io("http://localhost:3001");

export const SushiGoProvider = ({ children }: { children: React.ReactNode }) => {
	socket.on("updateGame", payload => updateGame(payload as Game));
	socket.on("updateLobby", payload => updateLobby(payload as Lobby));

	const gameReducer = (game: Game, payload: Game) => {
		console.log(JSON.parse(JSON.stringify({ ...game, ...payload })))
		return { ...game, ...payload };
	}
	const [game, updateGame] = useReducer(gameReducer, defaultGameState);

	const userReducer: React.Reducer<User, UserAction> = (user: User, action: UserAction) => {
		switch (action.type) {
			case 'update':
				return { ...user, ...action.payload };
			case 'clear':
				return {} as User;
			default:
				return user;
		}
	}
	const [user, dispatchUser] = useReducer(userReducer, {} as User);

	const updateUser = (payload: User) => {
		dispatchUser({ type: 'update', payload });
	}

	const clearUser = () => {
		dispatchUser({ type: 'clear' });
	}

	const lobbyReducer: React.Reducer<Lobby, LobbyAction> = (lobby: Lobby, action: LobbyAction) => {
		switch (action.type) {
			case 'update':
				return { ...lobby, ...action.payload }
			default:
				return lobby;
		}
	}

	const [lobby, dispatchLobby] = useReducer(lobbyReducer, new Lobby());

	const updateLobby = (payload: Lobby) => {
		dispatchLobby({ type: 'update', payload });
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
		lobby,
		updateLobby,
	};

	return (
		<SushiGoContext.Provider value={value}>
			{children}
		</SushiGoContext.Provider>
	);
}

export const useSushiGo = () => useContext(SushiGoContext);