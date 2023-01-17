import { useSushiGo } from "../contexts/SushiGoContext";
import { CARD_IMAGES } from "../game/Images";
import Card from "./Card";

const Game = () => {
	const { game } = useSushiGo();

	return game.player && (
		<div className="game-container">
			<div className="title-container">
				Round { game.round } - Turn { game.turn }
			</div>
			<div>
				{game.player.id}
			</div>
			<div>
				<div className="player-hand">
					{game.player.hand.map((card, i) => 
						<Card 
							key={i} 
							idx={i} 
							numCards={game.player?.hand.length || 0} 
							src={CARD_IMAGES[card.name]} 
						/>
					)}
				</div>
			</div>
			<button id="hide-hand-button">
				Hide hand
			</button>
		</div>
	);
}

export default Game;