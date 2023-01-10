import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext({} as SocketContextInterface);

interface SocketContextInterface { socket: Socket };
interface SocketProviderProps { children: React.ReactNode };

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = io("http://localhost:3001");
  console.log(socket)

  const value: SocketContextInterface = { socket };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);