import SwapIcon from "../icons/SwapIcon";
import { useSushiGo } from "../contexts/SushiGoContext";
import { PlayerHand, PlayerKeptHand } from "../components/Hands";
import { SERVER_URI } from "../CONSTANTS";

const Game = () => {
	const { game, user } = useSushiGo();

	return game.player && (
		<div className="game-container">
			<div className="player-info-container">
				{user.id && 
					<img 
						src={`${SERVER_URI}/images/profiles/${user.id}`} 
						alt={user.id}
					/>
				}	
				<div>
					{user.username}
				</div>
				<div>
					Score: {game.player.score}
				</div>
			</div>

			<div className="header-container">
				Round { game.round } - Turn { game.turn } / { game.maxTurns } | { game.roundStatus }
			</div>
			
			<div>
				<PlayerHand hand={game.player.hand} keptCard={game.player.keptCard} />
				<PlayerKeptHand hand={game.player.keptHand} />
			</div>
			{game.player.hadChopsticks && game.player.keptCard && game.player.keptHand.some(card => card.name === 'Chopsticks') && <SwapIcon width={25} />}
		</div>
	);
}

export default Game;