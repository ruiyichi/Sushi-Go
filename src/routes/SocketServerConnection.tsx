import { useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import { Outlet } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

const SocketServerConnection = () => {
	const { socketRef } = useSocket();
	const [isLoading, setIsLoading] = useState(true);
	const intervalID = useRef<NodeJS.Timer>();

	useEffect(() => {
		connectToSocketServer();
		intervalID.current = setInterval(connectToSocketServer, 5000);

		return () => {
			clearInterval(intervalID.current);
		};

	}, [socketRef.current]);

	const connectToSocketServer = async () => {
		if (socketRef.current?.connected) {
			clearInterval(intervalID.current);
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading
				? <Loading title='Connecting to socket server...' />
				: <Outlet />
			}
		</>
	);
}

export default SocketServerConnection;