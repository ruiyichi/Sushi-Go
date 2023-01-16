import * as Cards from "./Cards";
import chopsticks from "./assets/chopsticks.jpg";
import dumpling from "./assets/dumpling.jpg";
import eggnigiri from "./assets/eggnigiri.png";
import maki1 from "./assets/maki1.jpg";
import maki2 from "./assets/maki2.jpg";
import maki3 from "./assets/maki3.jpg";
import pudding from "./assets/pudding.jpg";
import salmonnigiri from "./assets/salmonnigiri.jpg";
import squidnigiri from "./assets/squidnigiri.png";
import sashimi from "./assets/sashimi.jpg";
import tempura from "./assets/tempura.jpg";
import wasabi from "./assets/wasabi.jpg";

export const CARD_SETTINGS: { [key: string]: { numCards: number, className: any, image: any } } = {
	"Tempura": {
		numCards: 14,
		className: Cards.Tempura,
		image: tempura
	},
	"Sashimi": {
		numCards: 14,
		className: Cards.Sashimi,
		image: sashimi
	},
	"Dumpling": {
		numCards: 14,
		className: Cards.Dumpling,
		image: dumpling
	},
	"Maki 1": {
		numCards: 6,
		className: Cards.Maki_1,
		image: maki1
	},
	"Maki 2": {
		numCards: 12,
		className: Cards.Maki_2,
		image: maki2
	},
	"Maki 3": {
		numCards: 8,
		className: Cards.Maki_3,
		image: maki3
	},
	"Salmon Nigiri": {
		numCards: 10,
		className: Cards.SalmonNigiri,
		image: salmonnigiri
	},
	"Squid Nigiri": {
		numCards: 5,
		className: Cards.SquidNigiri,
		image: squidnigiri
	},
	"Egg Nigiri": {
		numCards: 5,
		className: Cards.EggNigiri,
		image: eggnigiri
	},
	"Pudding": {
		numCards: 10,
		className: Cards.Pudding,
		image: pudding
	},
	"Wasabi": {
		numCards: 6,
		className: Cards.Wasabi,
		image: wasabi
	},
	"Chopsticks": {
		numCards: 4,
		className: Cards.Chopsticks,
		image: chopsticks
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