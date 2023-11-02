import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext";
import { useEffect } from "react";
import BaseScreen from "./BaseScreen";
import MenuButton from "../components/MenuButton";
import { UserImage } from "../components/User";
import { useLobby } from "../contexts/LobbyContext";
import { useUser } from "../contexts/UserContext";
import { useSocket } from "../contexts/SocketContext";

const Lobby = ({ code }: { code: string }) => {
	const { lobby } = useLobby();
	const { game } = useGame();
	const { user } = useUser();
	const { socketRef } = useSocket();
	const navigate = useNavigate();

	const is_host = lobby?.players?.[0].id === user.id;

	const preStartGame = () => {
		socketRef.current?.emit("preStartGame");
	};

	useEffect(() => {
		if (!lobby.players) {
			navigate('/');
		}
		if (game.status === 'Pending') {
			navigate('/game');
		}
	}, [game]);

	return (
		<BaseScreen id='lobby'>
			<div className='lobby-container'>
				<MenuButton 
					onClick={() => {
						navigator.clipboard.writeText(code);
					}}
				>
					CODE: { code }
				</MenuButton>
				
				<div className="players-container">
					{lobby?.players?.slice()?.sort?.((a, b) => {
						if (a.username === user.username) {
							return -1;
						}
						if (b.username === user.username) {
							return 1;
						} 
						return 0;
					}).map(player => (
							<div key={player.id}>
								<UserImage user={player} label={player.username === user.username ? "You" : undefined} />
							</div>
						))}
				</div>

				<div className="lobby-title">
					{ is_host ? "YOU are the host" : "Waiting for host to start..." }
					{is_host && lobby?.players?.length > 1 &&
						<MenuButton onClick={preStartGame}>
							Start game
						</MenuButton>
					}
				</div>
			</div>
		</BaseScreen>
	);
}

export default Lobby;