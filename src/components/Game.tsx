import { useSushiGo } from "../contexts/SushiGoContext";
import { CARDS_TO_DEAL } from "../game/Settings";
import { PlayerHand, PlayerKeptHand } from "./Hands";

const Game = () => {
	const { game } = useSushiGo();

	return game.player && (
		<div className="game-container">
			<div className="title-container">
				Round { game.round } - Turn { game.turn } / { CARDS_TO_DEAL[game.maxPlayers] }
			</div>
			<div>
				{game.player.id}
			</div>
			<div>
				<PlayerHand hand={game.player.hand} />
				<div className="player-score">
					Score: {game.player.score}
				</div>
				<PlayerKeptHand hand={game.player.keptHand} />
			</div>
		</div>
	);
}

export default Game;