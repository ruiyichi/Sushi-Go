import { useSearchParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

const Auth = () => {
	const [searchParams] = useSearchParams();
	const { socket } = useSocket();

	socket.emit('validateUser', searchParams.get('code'));
	return (
		<div>Redirecting...</div>
	)
}

export default Auth;