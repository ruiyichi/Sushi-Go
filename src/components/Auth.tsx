import localforage from "localforage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import { DiscordUser } from "../Interfaces";

const Auth = () => {
	const [searchParams] = useSearchParams();
	const { socket } = useSocket();
	const { user, updateUser } = useUser();
	const navigate = useNavigate();

	socket.emit('validateUser', searchParams.get('code'), (discordUser: DiscordUser) => {
		if (discordUser) {
			let { username, id } = discordUser;
			updateUser({ auth: true, username, id });
			localforage.setItem("user", { ...user, auth: true, username, id });
		}
		navigate('/');
	});
	return (
		<div>Redirecting...</div>
	)
}

export default Auth;