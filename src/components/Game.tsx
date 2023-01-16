import { useSushiGo } from "../contexts/SushiGoContext";

const Game = () => {
	const { game } = useSushiGo();
	return (
		<div className="game-container">
			<div className="title-container">
				Round { game.round } - Turn { game.turn }
			</div>
			<div>
				{game.player?.id}
			</div>
			<div>
				{game.player?.hand.map((card, i) => 
					<div key={i}>
						{card?.name}
					</div>
				)}
			</div>
		</div>
	)
}

export default Game;