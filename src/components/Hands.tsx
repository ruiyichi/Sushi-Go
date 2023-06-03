import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard } from "../game/Cards";
import { Card } from "./Cards";

export const PlayerHand = ({ hand, keptCard }: { hand: GameCard[], keptCard: boolean }) => {
	const { socketRef } = useSushiGo();

	return (
		<div className="player-hand">
			{hand.map((card, idx) => {
				return (
					<Card
						key={idx}
						cardName={card.name}
						onClick={() => socketRef.current?.emit(keptCard ? 'keepSecondCard' : 'keepCard', card, idx)}
					/>
				);
			})}
		</div>
	);
}