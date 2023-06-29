import { Opponent, useSushiGo } from "../contexts/SushiGoContext";
import { Player as PlayerClass } from "../game/Player";
import { UserImage } from "./User";
import { Card as GameCard, Nigiri, Wasabi, Tempura, Maki, Chopsticks, Pudding, Sashimi, Dumpling} from "../game/Cards";
import { Card } from "./Cards";
import { Game } from "../game/Game";

const Bucket = ({ bucket }: { bucket: GameCard[][] }) => {
	return (
		<>
			{bucket?.map((cards, i) => 
				<CardGroup key={i} cards={cards} />
			)}
		</>
	);
}

const CardGroup = ({ cards }: { cards: GameCard[] }) => {
	return (
		<div>
			{cards.map((card, i) => 
				<Card cardName={card.name} style={{ zIndex: cards.length - i, marginTop: i === 0 ? 0 : '-170%' }} key={i}/>
			)}
		</div>
	);
}

const RoundScore = ({ cards, playerID }: { cards: Array<GameCard>, playerID: string }) => {
	const { game } = useSushiGo();
	const playerCards = {} as Record<string, GameCard[]>;
	
	for (let player of game.players) {
		playerCards[player.id] = player.id === playerID ? cards : player.keptCards;
	}
	const scores = Game.scoreCards(playerCards, cards.some(c => c instanceof Maki), cards.some(c => c instanceof Pudding) && game.round === game.maxRounds);

	return (
		<div>
			Round score: {scores[playerID]}
		</div>
	);
}

const KeptCards = ({ keptCards }: { keptCards: GameCard[] }) => {
	const usedNigiris = keptCards.filter(c => c instanceof Nigiri && c.hasWasabi);
	const usedWasabis = keptCards.filter(c => c instanceof Wasabi && c.used);

	const pairedWasabiAndNigiris = usedNigiris.map((nigiri, i) => [usedWasabis[i], nigiri]);

	const bucketClasses = [Maki, Dumpling, Sashimi, Tempura, Nigiri, Pudding, Chopsticks];

	const bucketedCards = keptCards.filter(card => !usedNigiris.includes(card) && !usedWasabis.includes(card)).reduce((g: Record<string, GameCard[]>, c: GameCard) => {
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
		<>
			{bucketClasses.map(c => c.name).filter(bucketName => Object.keys(groupedCardNames).includes(bucketName)).map(bucketName => 
				<Bucket bucket={groupedCardNames[bucketName]} />
			)}
		</>
	);
}

const Player = ({ player }: { player: PlayerClass | Opponent }) => {
	return (
		<div className='player-container'>
			<div className='header-container'>
				<div>
					<UserImage user={player} />
				</div>
				<div>
					Total score: {player.score}
				</div>
			</div>
			<div className='content-container'>
				<div className='kept-cards'>
					<KeptCards keptCards={player.keptCards} />
				</div>
				<div>
					<RoundScore cards={player.keptCards} playerID={player.id} />
				</div>
			</div>
		</div>
	);
}

export default Player;