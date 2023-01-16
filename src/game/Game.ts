import { Card } from "./Cards"
import { Player } from "./Player";
import { CARD_SETTINGS, CARDS_TO_DEAL } from "./Settings";

export class Game {
	deck: Card[];
	discardDeck: Card[];
	players: Player[];
	round: number;
	turn: number;

	constructor(players: Player[]) {
		this.deck = [];
		this.discardDeck = [];
		this.players = players;
		this.round = 1;
		this.turn = 1;

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
				player.hand.push(this.deck.pop());
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
}