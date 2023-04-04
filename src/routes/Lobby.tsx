import { useNavigate } from "react-router-dom";
import { useSushiGo } from "../contexts/SushiGoContext";
import { useEffect } from "react";

const Lobby = ({ code }: { code: string }) => {
	const { lobby, game, user, socket } = useSushiGo();
	const navigate = useNavigate();

	const is_host = lobby?.playerIDs?.[0] === user.username;

	const startGame = () => {
		socket.emit("startGame");
	};

	useEffect(() => {
		if (!lobby.playerIDs) {
			navigate('/');
		}
		if (game.status === 'In progress') {
			navigate('/game');
		}
	}, [game]);

	return (
		<div className="lobby-container">
			<div className="game-code-container">
				Game code: { code }
			</div>
			<div className="lobby-title">
				{ is_host ? "YOU are the host" : "Waiting for the host to start" }
				{is_host && lobby?.playerIDs?.length > 1 &&
					<button onClick={startGame}>
						Start game
					</button>
				}
			</div>
			<div className="players-container">
				Players: { lobby?.playerIDs?.length }/{ lobby?.maxPlayers }
				{ lobby?.playerIDs?.map(id => (
					<div key={id}>
						{ id }
					</div>
				))}
			</div>
		</div>
	);
}

export default Lobby;