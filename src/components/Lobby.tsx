import { useGame } from "../contexts/GameContext";

const Lobby = () => {
	const { game } = useGame();
	return (
		<div className="lobby-container">
			<div className="game-code-container">
				Game code: { game.code }
			</div>
		</div>
	)
}

export default Lobby