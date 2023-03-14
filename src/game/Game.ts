import * as Cards from "./Cards"
import { Player } from "./Player";
import { CARD_SETTINGS, CARDS_TO_DEAL, NUM_ROUNDS } from "./Settings";

export class Game {
	deck: Cards.Card[];
	discardDeck: Cards.Card[];
	players: Player[];
	round: number;
	turn: number;
	maxTurns: number;
	maxRounds: number;

	constructor(players: Player[]=[]) {
		this.deck = [];
		this.discardDeck = [];
		this.players = players;
		this.round = 1;
		this.turn = 1;
		this.maxTurns = CARDS_TO_DEAL[this.players.length];
		this.maxRounds = NUM_ROUNDS;

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

	scoreRound(finalRound=false) {
		let makis = {} as { [key: string]: number };
		let playersWithMostMakis = [];
		let playersWithSecondMostMakis = [];
		let puddings = {} as { [key: string]: number };

		this.players.forEach(player => {
			let roundScore = 0;
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
					if (finalRound) {
						puddingCount += 1;
					}
				}
				else {
					roundScore += card.pointValue();
				}
			});

			roundScore += Cards.Tempura.pointValue(tempuraCount);
			roundScore += Cards.Dumpling.pointValue(dumplingCount);
			roundScore += Cards.Sashimi.pointValue(sashimiCount);
			player.score += roundScore;

			makis[player.id] = makiCount;
			if (finalRound) {
				puddings[player.id] = puddingCount;
			}
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

		
	}
}