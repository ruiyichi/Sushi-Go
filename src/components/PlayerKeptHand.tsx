import { Card as GameCard, Nigiri, Wasabi, Tempura, Maki, Chopsticks, Pudding, Sashimi, Dumpling} from "../game/Cards";
import { Card } from "./Cards";

const Bucket = ({ bucket }: { bucket: string[][] }) => {
	return (
		<div className='bucket-container'>
			{bucket?.map(cardNames => 
				<CardGroup cardNames={cardNames} />
			)}
		</div>
	);
}

const CardGroup = ({ cardNames }: { cardNames: string[] }) => {
	return (
		<div>
			{cardNames.map((cardName, i) => 
				<Card cardName={cardName} height={100} style={{ zIndex: i, marginTop: i === 0 ? 0 : '-120%' }}/>
			)}
		</div>
	);
}

const Score = ({ cardNames }: { cardNames: Array<string>}) => {
	return (
		<div>
			Score: {cardNames}
		</div>
	);
}

const PlayerKeptHand = ({ hand }: { hand: GameCard[] }) => {
	const usedNigiris = hand.filter(c => c.type === 'Nigiri' && 'hasWasabi' in c && c.hasWasabi);
	const usedWasabis = hand.filter(c => c.type === 'Wasabi' && 'used' in c && c.used);

	const pairedWasabiAndNigiris = usedNigiris.map((nigiri, i) => [usedWasabis[i].name, nigiri.name]);

	const buckets = [Maki.name, Dumpling.name, Sashimi.name, Tempura.name, Nigiri.name, Pudding.name, Chopsticks.name];

	const bucketedHand = hand.filter(card => !usedNigiris.includes(card) && !usedWasabis.includes(card)).reduce((g: Record<string, string[]>, c: GameCard) => {
		const bucketName = c.type === Wasabi.name ? "Sashimi" : buckets[buckets.findIndex(bucketName => bucketName.includes(c.type))];
		g[bucketName] = g[bucketName] || [];
		g[bucketName].push(c.name);
		return g;
	}, Object.create(null));

	const groupedCardNames = Object.fromEntries(
		Object.entries(bucketedHand).map(([key, value]) => [key, value.sort().reduce((result: string[][], current: string) => {
			if (result.length === 0 || result[result.length - 1][0] !== current) {
				result.push([current]);
			} else {
				result[result.length - 1].push(current);
			}
			return result;
		}, [])])
	);
	
	if (pairedWasabiAndNigiris.length > 0) {
		groupedCardNames["Sashimi"] = groupedCardNames["Sashimi"] || [];
		groupedCardNames["Sashimi"].push(...pairedWasabiAndNigiris);
	}

	return (
		<div className="player-kept-hand-container">
			<div className="title">
				You
			</div>
			<div className="player-kept-hand">
				{buckets.filter(bucketName => Object.keys(groupedCardNames).includes(bucketName)).map(bucketName => 
					<div className="buckets-container">
						{bucketName}
						<Bucket bucket={groupedCardNames[bucketName]} />
						<Score cardNames={groupedCardNames[bucketName].flat()}/>
					</div>
				)}
			</div>
		</div>
	);
}

export default PlayerKeptHand;