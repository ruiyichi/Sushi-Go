import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard, Nigiri, Wasabi, Tempura, Maki, Chopsticks, Pudding, Sashimi, Dumpling} from "../game/Cards";
import { Game } from "../game/Game";
import { Card } from "./Cards";

const Bucket = ({ bucket }: { bucket: GameCard[][] }) => {
	return (
		<div className='bucket-container'>
			{bucket?.map(cards => 
				<CardGroup cards={cards} />
			)}
		</div>
	);
}

const CardGroup = ({ cards }: { cards: GameCard[] }) => {
	return (
		<div>
			{cards.map((card, i) => 
				<Card cardName={card.name} height={100} style={{ zIndex: i, marginTop: i === 0 ? 0 : '-120%' }}/>
			)}
		</div>
	);
}

const Points = ({ cards }: { cards: Array<GameCard>}) => {
	const { game } = useSushiGo();
	const playerCards = {[game?.player?.id as string]: cards} as Record<string, GameCard[]>;
	
	for (let player of game.players) {
		playerCards[player.id] = player.keptCards;
	}
	const points = Game.scoreCards(playerCards, cards.some(c => c instanceof Maki));
	return game.player && (
		<div className="points-container">
			Points: {points[game?.player?.id]}
		</div>
	);
}

const PlayerKeptCards = ({ hand }: { hand: GameCard[] }) => {
	const usedNigiris = hand.filter(c => c instanceof Nigiri && c.hasWasabi);
	const usedWasabis = hand.filter(c => c instanceof Wasabi && c.used);

	const pairedWasabiAndNigiris = usedNigiris.map((nigiri, i) => [usedWasabis[i], nigiri]);

	const bucketClasses = [Maki, Dumpling, Sashimi, Tempura, Nigiri, Pudding, Chopsticks];

	const bucketedCards = hand.filter(card => !usedNigiris.includes(card) && !usedWasabis.includes(card)).reduce((g: Record<string, GameCard[]>, c: GameCard) => {
		const bucketName = c instanceof Wasabi ? Nigiri.name : bucketClasses[bucketClasses.findIndex(bucketName => c instanceof bucketName)].name;
		g[bucketName] = g[bucketName] || [];
		g[bucketName].push(c);
		return g;
	}, Object.create(null));

	const groupedCardNames = Object.fromEntries(
		Object.entries(bucketedCards).map(([key, values]) => [key, GameCard.sort(values).reduce((result: GameCard[][], current: GameCard) => {
				if (result.length === 0 || result[result.length - 1][0].name !== current.name) {
					result.push([current]);
				} else {
					result[result.length - 1].push(current);
				}
				return result;
			}, [])
		])
	);
	
	if (pairedWasabiAndNigiris.length > 0) {
		groupedCardNames[Nigiri.name] = groupedCardNames[Nigiri.name] || [];
		groupedCardNames[Nigiri.name].push(...pairedWasabiAndNigiris);
	}

	return (
		<div className="player-kept-hand-container">
			<div className="title">
				You
			</div>
			<div className="player-kept-hand">
				{bucketClasses.map(c => c.name).filter(bucketName => Object.keys(groupedCardNames).includes(bucketName)).map(bucketName => 
					<div className="buckets-container">
						{bucketName}
						<Bucket bucket={groupedCardNames[bucketName]} />
						<Points cards={groupedCardNames[bucketName].flat()}/>
					</div>
				)}
			</div>
		</div>
	);
}

export default PlayerKeptCards;