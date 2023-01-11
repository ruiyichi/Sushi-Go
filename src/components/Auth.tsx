import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import { DiscordUser } from "../Interfaces";

const Auth = () => {
	const [searchParams] = useSearchParams();
	const { socket } = useSocket();
	const { dispatch } = useUser();
	const navigate = useNavigate();

	socket.emit('validateUser', searchParams.get('code'), (user: DiscordUser) => {
		if (user) {
			let { username, id } = user;
			dispatch({ auth: true, username, id });
		}
		navigate('/');
	});
	return (
		<div>Redirecting...</div>
	)
}

export default Auth;