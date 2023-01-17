import * as Cards from "./Cards";

export const CARD_SETTINGS: { [key: string]: { numCards: number, className: any } } = {
	"Tempura": {
		numCards: 14,
		className: Cards.Tempura,
	},
	"Sashimi": {
		numCards: 14,
		className: Cards.Sashimi,
	},
	"Dumpling": {
		numCards: 14,
		className: Cards.Dumpling,
	},
	"Maki 1": {
		numCards: 6,
		className: Cards.Maki_1,
	},
	"Maki 2": {
		numCards: 12,
		className: Cards.Maki_2,
	},
	"Maki 3": {
		numCards: 8,
		className: Cards.Maki_3,
	},
	"Salmon Nigiri": {
		numCards: 10,
		className: Cards.SalmonNigiri,
	},
	"Squid Nigiri": {
		numCards: 5,
		className: Cards.SquidNigiri,
	},
	"Egg Nigiri": {
		numCards: 5,
		className: Cards.EggNigiri,
	},
	"Pudding": {
		numCards: 10,
		className: Cards.Pudding,
	},
	"Wasabi": {
		numCards: 6,
		className: Cards.Wasabi,
	},
	"Chopsticks": {
		numCards: 4,
		className: Cards.Chopsticks,
	},
}

export const CARDS_TO_DEAL: { [key: number]: number } = {
	2: 10,
	3: 9,
	4: 8,
	5: 7,
};

export const NUM_ROUNDS = 3;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 5;