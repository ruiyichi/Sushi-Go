import { useSushiGo } from "../contexts/SushiGoContext";

const Lobby = () => {
	const { game, user, socket } = useSushiGo();

	const is_host = game.playerIDs?.[0] === user.id;

	const startGame = () => socket.emit("startGame");

	return (
		<div className="lobby-container">
			<div className="game-code-container">
				Game code: { game.code }
			</div>
			<div className="lobby-title">
				{ is_host ? "YOU are the host" : "Waiting for the host to start" }
				{is_host && game.playerIDs.length === game.maxPlayers &&
					<button onClick={startGame}>
						Start game
					</button>
				}
			</div>
			<div className="players-container">
				Players: { game.playerIDs.length }/{ game.maxPlayers }
				{ game.playerIDs.map(id => (
					<div key={id}>
						{ id }
					</div>
				))}
			</div>
		</div>
	)
}

export default Lobby