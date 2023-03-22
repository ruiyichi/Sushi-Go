import SwapIcon from "../assets/SwapIcon";
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
				{ game.player.id }
			</div>
			<div>
				{ game.phase }
			</div>
			<div>
				<PlayerHand hand={game.player.hand} keptCard={game.player.keptCard} />
				<div className="player-score">
					Score: {game.player.score}
				</div>
				<PlayerKeptHand hand={game.player.keptHand} />
			</div>
			{game.player.hadChopsticks && game.player.keptCard && game.player.keptHand.some(card => card.name === 'Chopsticks') && <SwapIcon width={25} />}
		</div>
	);
}

export default Game;