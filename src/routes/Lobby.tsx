import { useNavigate } from "react-router-dom";
import { useSushiGo } from "../contexts/SushiGoContext";
import { useEffect } from "react";
import Logo from "../components/Logo";

const Lobby = ({ code }: { code: string }) => {
	const { lobby, game, user, socketRef } = useSushiGo();
	const navigate = useNavigate();

	const is_host = lobby?.players?.[0].id === user.id;

	const startGame = () => {
		socketRef.current?.emit("startGame");
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
		<div className="lobby-container">
			<Logo />

			<button 
				id="game-code-button"
				onClick={() => {
					navigator.clipboard.writeText(code);
				}}
			>
				CODE: { code }
			</button>
			
			<div className="players-container">
				{lobby?.players?.slice()?.sort?.((a, b) => {
					if (a.username === user.username) {
						return -1;
					} else if (b.username === user.username) {
						return 1;
					} else {
						return 0;
					}}).map(player => (
						<div key={player.id}>
							{ player.username === user.username ? 'You' : player.username }
						</div>
					))}
			</div>

			<div className="lobby-title">
				{ is_host ? "YOU are the host" : "Waiting for host to start..." }
				{is_host && lobby?.players?.length > 1 &&
					<button onClick={startGame}>
						Start game
					</button>
				}
			</div>
		</div>
	);
}

export default Lobby;