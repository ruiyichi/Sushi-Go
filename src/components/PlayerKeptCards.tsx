import { Opponent } from "../contexts/SushiGoContext";
import { useSushiGo } from "../contexts/SushiGoContext";
import { Card as GameCard, Nigiri, Wasabi, Tempura, Maki, Chopsticks, Pudding, Sashimi, Dumpling} from "../game/Cards";
import { Game } from "../game/Game";
import { Card, CardIcon } from "./Cards";
import React from "react";
import { UserImage } from "./UserInfo";
import { Player } from "../game/Player";

const Bucket = ({ bucket, CardGroupType }: { bucket: GameCard[][], CardGroupType: React.ComponentType<{ cards: GameCard[] }> }) => {
	return (
		<div className='bucket-container'>
			{bucket?.map(cards => 
				<CardGroupType cards={cards} />
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

export const CardIconGroup = ({ cards }: { cards: GameCard[] }) => {
	return (
		<div>
			{cards.map((card, i) => 
				<CardIcon cardName={card.name} height={30} />
			)}
		</div>
	);
}

const Points = ({ cards, playerID }: { cards: Array<GameCard>, playerID: string }) => {
	const { game } = useSushiGo();
	const playerCards = {} as Record<string, GameCard[]>;
	const allPlayers = game.opponents.concat(game?.player as Opponent);
	
	for (let player of allPlayers) {
		playerCards[player.id] = player.id === playerID ? cards : player.keptCards;
	}
	const points = Game.scoreCards(playerCards, cards.some(c => c instanceof Maki), cards.some(c => c instanceof Pudding) && game.round === game.maxRounds);

	return game.player && (
		<div className="points-container">
			Points: {points[playerID]}
		</div>
	);
}

export const PlayerKeptHand = ({ player, CardGroupType }: { player: Opponent, CardGroupType: React.ComponentType<{ cards: GameCard[] }> }) => {
	const hand = player.keptCards;
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
		<div className="player-kept-hand">
			{bucketClasses.map(c => c.name).filter(bucketName => Object.keys(groupedCardNames).includes(bucketName)).map(bucketName => 
				<div className="buckets-container">
					<div className="bucket-label">
						{bucketName}
					</div>
					<Bucket bucket={groupedCardNames[bucketName]} CardGroupType={CardGroupType} />
					<Points cards={groupedCardNames[bucketName].flat()} playerID={player.id} />
				</div>
			)}
		</div>
	)
}

export const PlayerKeptCards = ({ player }: { player: Player }) => {
	return (
		<div className="player-kept-hand-container">
			<div className="title">
				You
			</div>
			<div className="content">
				<div className="score-container">
					Score: {player.score}
				</div>
				<PlayerKeptHand player={player} CardGroupType={CardGroup} />
			</div>
		</div>
	);
}

export const OpponentsKeptCards = ({ players }: { players: Opponent[] }) => {
	return (
		<div className="other-players-hands-container">
			<div className="title">
				Opponents
			</div>
			<div className="other-players-hands">
				{players.map(player => {
					return (
						<div className="opponent-hand-container">
							<div className='opponent-info-container'>
								<div className='opponent-info'>
									<UserImage userID={player.id} />
									{player.username}
								</div>
								Score: {player.score}
							</div>
							<div>
								<PlayerKeptHand player={player} CardGroupType={CardIconGroup}/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}