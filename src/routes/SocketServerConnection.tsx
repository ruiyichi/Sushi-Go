import { useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import { Outlet } from "react-router-dom";
import { useSushiGo } from "../contexts/SushiGoContext";

const SocketServerConnection = () => {
	const { socketRef } = useSushiGo();
	const [isLoading, setIsLoading] = useState(true);
	const intervalID = useRef<NodeJS.Timer>();

	useEffect(() => {
		connectToSocketServer();
		intervalID.current = setInterval(connectToSocketServer, 5000);

		return () => {
			clearInterval(intervalID.current);
		};

	}, []);

	const connectToSocketServer = async () => {
		if (socketRef.current?.connected) {
			clearInterval(intervalID.current);
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading
				? <Loading title={'Connecting to socket server...'} />
				: <Outlet />
			}
		</>
	);
}

export default SocketServerConnection;