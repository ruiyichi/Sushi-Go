import { createContext, useContext, useEffect, useReducer, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Player } from "../game/Player";
import { Card } from "../game/Cards";
import { Lobby } from "../game/Lobby";
import { SOCKET_SERVER_URI } from "../CONSTANTS";

const SushiGoContext = createContext({} as SushiGoInterface);

interface User {
	id: string,
	username: string,
	accessToken: string,
};

export interface ProtectedPlayer {
	id: string,
	username: string,
	keptHand: Card[],
	score: number,
};

interface SushiGoInterface { 
	game: Game,
	updateGame: React.Dispatch<any>,
	socketRef: React.MutableRefObject<Socket | undefined>,
	user: User,
	updateUser: React.Dispatch<any>,
	clearUser: React.Dispatch<any>,
	persist: string,
	setPersist: React.Dispatch<any>,
	lobby: Lobby,
	updateLobby: React.Dispatch<any>,
	getUpdatedGame: Function
};
interface Game {
	status: "In lobby" | "Pending" | "Completed",
	player: null | Player,
	players: ProtectedPlayer[],
	turn: number,
	round: number,
	roundStatus: string,
	maxTurns: number,
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
	roundStatus: "",
	maxTurns: 0
} as Game;

export const SushiGoProvider = ({ children }: { children: React.ReactNode }) => {
	const socketRef = useRef<undefined | Socket>();

	const gameReducer = (game: Game, payload: Game) => {
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

	useEffect(() => {
		socketRef.current = io(SOCKET_SERVER_URI, { query: { token: user.accessToken }});
		socketRef.current.on("updateGame", payload => updateGame(payload as Game));
		socketRef.current.on("updateLobby", payload => updateLobby(payload as Lobby));

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		}
	}, [user.accessToken]);

	const updateUser = (payload: User) => {
		dispatchUser({ type: 'update', payload });
	}

	const clearUser = () => {
		dispatchUser({ type: 'clear' });
	}

	const lobbyReducer: React.Reducer<Lobby, LobbyAction> = (lobby: Lobby, action: LobbyAction) => {
		switch (action.type) {
			case 'update':
				return { ...lobby, ...action.payload };
			default:
				return lobby;
		}
	}

	const [lobby, dispatchLobby] = useReducer(lobbyReducer, {} as Lobby);

	const updateLobby = (payload: Lobby) => {
		dispatchLobby({ type: 'update', payload });
	}

	const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist') || 'false') || false);

	const getUpdatedGame = () => {
		socketRef.current?.emit("getGame");
	}

	const value: SushiGoInterface = { 
		game,
		updateGame,
		socketRef,
		user,
		updateUser,
		clearUser,
		persist,
		setPersist,
		lobby,
		updateLobby,
		getUpdatedGame,
	};

	return (
		<SushiGoContext.Provider value={value}>
			{children}
		</SushiGoContext.Provider>
	);
}

export const useSushiGo = () => useContext(SushiGoContext);