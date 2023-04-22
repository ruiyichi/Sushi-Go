import * as Cards from "./Cards"
import { v4 as uuid } from "uuid";
import { Player } from "./Player";
import { CARD_SETTINGS, CARDS_TO_DEAL, NUM_ROUNDS } from "./Settings";

export class Game {
	id: string;
	deck: Cards.Card[];
	discardDeck: Cards.Card[];
	players: Player[];
	round: number;
	turn: number;
	maxTurns: number;
	maxRounds: number;
	roundStatus: string;
	status: string;
	startTime: number;

	constructor(players: Player[]=[]) {
		this.id = uuid();
		this.deck = [];
		this.discardDeck = [];
		this.players = players;
		this.round = 1;
		this.turn = 1;
		this.maxTurns = CARDS_TO_DEAL[this.players.length];
		this.maxRounds = NUM_ROUNDS;
		this.roundStatus = "";
		this.status = "In progress";
		this.startTime = Date.now();

		//this.updateRoundStatus();
		this.setDeck();
		this.shuffleDeck();
		this.dealCards();
	}

	updateRoundStatus() {
		this.roundStatus = `Waiting for players ${this.players.filter(p => !p.keptCard).map(p => p.id).join(', ')} to play`;
	}

	setDeck() {
		Object.keys(CARD_SETTINGS).forEach(cardName => {
			let cardSetting = CARD_SETTINGS[cardName];
			let { className } = cardSetting;
			for (let i = 0; i < cardSetting.numCards; i++) {
				this.deck.push(new className());
			}
		});
	}

	setStartTime() {
		this.startTime = Date.now();
	}

	shuffleDeck() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}

	dealCards() {
		this.players.forEach(player => {
			for (let i = 0; i < CARDS_TO_DEAL[this.players.length]; i++) {
				let topCard = this.deck.pop();
				if (topCard) {
					player.hand.push(topCard);
				}
			}
		})
	}

	rotateHands() {
		let oldHands = this.players.map(player => player.hand);
		let rotatedHands = oldHands.slice(-1).concat(oldHands.slice(0, -1));
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].hand = rotatedHands[i];
		}
	}

	nextRound() {
		this.scoreRound();
		this.players.forEach(p => p.clearKeptHand());
		this.round += 1;
		this.turn = 1;
		this.dealCards();
		this.clearPlayersKeptCard();
	}

	nextTurn() {
		this.turn += 1;
		this.rotateHands();
		this.clearPlayersKeptCard();
		this.players.forEach(p => p.setHadChopsticks());
	}

	finalRound() {
		this.scoreRound();
		this.players.forEach(p => p.clearKeptHand());
		this.clearPlayersKeptCard();
		this.status = 'Completed';
	}

	clearPlayersKeptCard() {
		this.players.forEach(p => p.keptCard = false);
	}

	scoreRound() {
		let finalRound = this.round === this.maxRounds;
		
		let makis = {} as { [key: string]: number };
		let playersWithMostMakis = [];
		let playersWithSecondMostMakis = [];
		let puddings = {} as { [key: string]: number };

		this.players.forEach(player => {
			let makiCount = 0;
			let puddingCount = 0;
			let tempuraCount = 0;
			let dumplingCount = 0;
			let sashimiCount = 0;

			player.keptHand.forEach(card => {
				if (card instanceof Cards.Maki) {
					makiCount += card.numRolls;
				}
				else if (card instanceof Cards.Tempura) {
					tempuraCount += 1;
				}
				else if (card instanceof Cards.Dumpling) {
					dumplingCount += 1;
				}
				else if (card instanceof Cards.Sashimi) {
					sashimiCount += 1;
				}
				else if (card instanceof Cards.Pudding) {
					puddingCount += 1;
				}
				else {
					player.score += card.pointValue();
				}
			});

			player.score += Cards.Tempura.pointValue(tempuraCount);
			player.score += Cards.Dumpling.pointValue(dumplingCount);
			player.score += Cards.Sashimi.pointValue(sashimiCount);

			makis[player.id] = makiCount;
			puddings[player.id] = puddingCount;
		});

		let mostMakis = Math.max(...Object.values(makis));
		let secondMostMakis = Object.values(makis).sort((a, b) => b - a)[1];

		for (let playerID of Object.keys(makis)) {
			let numPlayerMakis = makis[playerID];
			if (numPlayerMakis === mostMakis) {
				playersWithMostMakis.push(playerID);
			}
			else if (numPlayerMakis === secondMostMakis) {
				playersWithSecondMostMakis.push(playerID);
			}
		}

		for (let playerID of playersWithMostMakis) {
			let player = this.players.find(p => p.id === playerID);
			if (player) {
				player.score += Math.floor(Cards.Maki.pointValue("most") / playersWithMostMakis.length);
			}
		}

		for (let playerID of playersWithSecondMostMakis) {
			let player = this.players.find(p => p.id === playerID);
			if (player) {
				player.score += Math.floor(Cards.Maki.pointValue("secondMost") / playersWithSecondMostMakis.length);
			}
		}

		if (finalRound) {
			let mostPuddings = Math.max(...Object.values(puddings));
			let leastPuddings = Math.min(...Object.values(puddings));
			let mostPuddingPlayerIDs = [];
			let leastPuddingPlayerIDs = [];

			for (let playerID of Object.keys(puddings)) {
				if (puddings[playerID] === mostPuddings) {
					mostPuddingPlayerIDs.push(playerID);
				}
				else if (puddings[playerID] === leastPuddings) {
					leastPuddingPlayerIDs.push(playerID);
				}
			}

			for (let playerID of mostPuddingPlayerIDs) {
				let player = this.players.find(p => p.id === playerID);
				if (player) {
					player.score += Math.floor(Cards.Pudding.pointValue("most") / mostPuddingPlayerIDs.length);
				}
			}

			for (let playerID of leastPuddingPlayerIDs) {
				let player = this.players.find(p => p.id === playerID);
				if (player) {
					player.score += Math.floor(Cards.Pudding.pointValue("least") / leastPuddingPlayerIDs.length);
				}
			}
		}
	}
}