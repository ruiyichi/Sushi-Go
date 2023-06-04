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
	roundStartTime: number;
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
		this.status = "Pending";
		this.roundStatus = "";
		this.startTime = Date.now();
		this.roundStartTime = Date.now();

		//this.updateRoundStatus();
		this.setDeck();
		this.shuffleDeck();
		this.dealCards();
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

	setRoundStartTime() {
		this.roundStartTime = Date.now();
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
		let playerCards = {} as Record<string, Array<Cards.Card>>;
		for (let player of this.players) {
			playerCards[player.id] = player.keptCards;
		}
		let points = Game.scoreCards(playerCards, true);
		this.players.forEach(p => {
			if (p.id in points) {
				p.score += points[p.id];
			}
			p.clearKeptHand();
		});
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
		let playerCards = {} as Record<string, Array<Cards.Card>>;
		for (let player of this.players) {
			playerCards[player.id] = player.keptCards;
		}
		let points = Game.scoreCards(playerCards, true, true);
		this.players.forEach(p => {
			if (p.id in points) {
				p.score += points[p.id];
			}
			p.clearKeptHand();
		});
		this.clearPlayersKeptCard();
		this.status = "Completed";
		this.roundStatus = "";
	}

	clearPlayersKeptCard() {
		this.players.forEach(p => p.keptCard = false);
	}

	static scoreCards(playerCards: Record<string, Cards.Card[]>, includeMakis=false, finalRound=false) {
		let makis = {} as { [key: string]: number };
		let playersWithMostMakis = [];
		let playersWithSecondMostMakis = [];
		let puddings = {} as { [key: string]: number };
		let points = {} as { [key: string]: number };
		for (let id of Object.keys(playerCards)) {
			points[id] = 0;
		}

		Object.keys(playerCards).forEach(id => {
			let makiCount = 0;
			let puddingCount = 0;
			let tempuraCount = 0;
			let dumplingCount = 0;
			let sashimiCount = 0;

			playerCards[id].forEach(card => {
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
					points[id] += card.pointValue();
				}
			});

			points[id] += Cards.Tempura.pointValue(tempuraCount);
			points[id] += Cards.Dumpling.pointValue(dumplingCount);
			points[id] += Cards.Sashimi.pointValue(sashimiCount);

			makis[id] = makiCount;
			puddings[id] = puddingCount;
		});

		if (includeMakis) {
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
	
			for (let id of playersWithMostMakis) {
				points[id] += Math.floor(Cards.Maki.pointValue("most") / playersWithMostMakis.length);
			}
	
			for (let id of playersWithSecondMostMakis) {
				points[id] += Math.floor(Cards.Maki.pointValue("secondMost") / playersWithSecondMostMakis.length);
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

			for (let id of mostPuddingPlayerIDs) {
				points[id] += Math.floor(Cards.Pudding.pointValue("most") / mostPuddingPlayerIDs.length);
			}

			for (let id of leastPuddingPlayerIDs) {
				points[id] += Math.floor(Cards.Pudding.pointValue("least") / leastPuddingPlayerIDs.length);
			}
		}

		return points;
	}
}