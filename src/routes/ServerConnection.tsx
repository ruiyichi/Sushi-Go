import { useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import { Outlet } from "react-router-dom";
import axios from "../api/axios";

const ServerConnection = () => {
	const [isLoading, setIsLoading] = useState(true);
	const intervalID = useRef<NodeJS.Timer>();

	useEffect(() => {
		isServerRunning();
		intervalID.current = setInterval(isServerRunning, 5000);

    return () => {
      clearInterval(intervalID.current);
    };

	}, []);

	const isServerRunning = async () => {
		try {
			let response = await axios.get('/ping');
			if (response.status === 200) {
				clearInterval(intervalID.current);
				setIsLoading(false);
			}
		}
		catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			{isLoading
				? <Loading title='Connecting to server...' />
				: <Outlet />
			}
		</>
	);
}

export default ServerConnection;