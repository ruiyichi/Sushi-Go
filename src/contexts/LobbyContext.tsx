import { createContext, useContext, useReducer } from "react";
import { Lobby } from "../game/Lobby";

export type User = {
	id: string,
	username: string,
	accessToken: string,
	profilePicture: string
};

type LobbyAction = { 
	type: 'update', 
	payload: Lobby 
};

type LobbyContextValue = {
  lobby: Lobby,
	updateLobby: React.Dispatch<any>
};

const LobbyContext = createContext({} as LobbyContextValue);

export const LobbyProvider = ({ children }: { children: React.ReactNode }) => {
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

  const value: LobbyContextValue = {
    lobby,
		updateLobby
  };

  return (
		<LobbyContext.Provider value={value}>
			{children}
		</LobbyContext.Provider>
	);
};

export const useLobby = () => useContext(LobbyContext);