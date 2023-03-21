import { useSushiGo } from "../contexts/SushiGoContext";
import { CARDS_TO_DEAL } from "../game/Settings";
import { HandCard, PlayedCard } from "./Cards";

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
				<div className="player-hand">
					{game.player.hand.map((card, i) => 
						<HandCard 
							idx={i} 
							numCards={game.player?.hand.length || 0}
							card={card}
						/>
					)}
				</div>
				<div className="player-score">
					Score: {game.player.score}
				</div>
				<div className="player-kept-hand">
					{game.player.keptHand.map((card, i) => 
						<PlayedCard
							key={i}
							card={card}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Game;