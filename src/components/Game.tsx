import { useSushiGo } from "../contexts/SushiGoContext";
import { CARD_IMAGES } from "../game/Images";

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
				{game.player.hand.map((card, i) => (
					<div>
						<img key={i} src={CARD_IMAGES[card.name] } />
					</div>
				))}
			</div>
		</div>
	);
}

export default Game;