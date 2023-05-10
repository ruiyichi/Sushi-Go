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

export const PlayerKeptHand = ({ hand }: { hand: GameCard[] }) => {
	const usedNigiris = hand.filter(c => c.name.includes('Nigiri') && 'hasWasabi' in c && c.hasWasabi);
	const usedWasabis = hand.filter(c => c.name === 'Wasabi' && 'used' in c && c.used);

	const pairedWasabiAndNigiris = usedNigiris.map((nigiri, i) => [usedWasabis[i], nigiri]);

	const groupedHand = hand.filter(card => !usedNigiris.includes(card) && !usedWasabis.includes(card)).reduce((g: Record<string, GameCard[]>, c: GameCard) => {
    g[c.name] = g[c.name] || [];
    g[c.name].push(c);
    return g;
  }, Object.create(null));

	return (
		<div className="player-kept-hand">
			{Object.values(groupedHand).concat(pairedWasabiAndNigiris).map(group => 
				<div className="group">
					{group.map((card, idx) => 
						<Card
							cardName={card.name}
							style={{ zIndex: idx, top: -120 * idx }}
						/>
					)}
				</div>
			)}
		</div>
	);
}