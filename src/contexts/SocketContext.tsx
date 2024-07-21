import { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_SERVER_URI } from "../CONSTANTS";
import { useUser } from "./UserContext";
import { Game, useGame } from "./GameContext";
import { Lobby } from "../game/Lobby";
import { useLobby } from "./LobbyContext";

type SocketContextValue = {
  socketRef: React.MutableRefObject<Socket | undefined>,
};

const SocketContext = createContext({} as SocketContextValue);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<undefined | Socket>();

  const { user } = useUser();
  const { updateGame } = useGame();
  const { updateLobby } = useLobby();

  useEffect(() => {
		if (user.accessToken) {
			socketRef.current = io(SOCKET_SERVER_URI, { query: { token: user.accessToken }});
			socketRef.current.on("updateGame", payload => updateGame(payload as Game));
			socketRef.current.on("updateLobby", payload => updateLobby(payload as Lobby));
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		}
	}, [user.accessToken]);

  const value: SocketContextValue = {
		socketRef
  };

  return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);