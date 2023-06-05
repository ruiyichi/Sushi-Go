export class Card {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	static pointValue(...params: any) {
		return 0;
	}

	static sort(cards: Card[]) {
		return cards.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
	}

	pointValue(...params: any) {
		return 0;
	}

	static castToInstance(card: { name: string }) {
		let instance = Object.create(Card.prototype);
		if (Object.keys(CARD_PROPERTIES).includes(card.name)) {
			instance = Object.create(CARD_PROPERTIES[card.name].prototype);
		}
		return Object.assign(instance, card);
	}
}

export class Tempura extends Card {
	constructor() {
		super("Tempura");
	}

	static pointValue(numCards: number) {
		return Math.floor(numCards / 2) * 5;
	}
}

export class Maki extends Card {
	numRolls: number;

	constructor(numRolls: number) {
		super(`Maki ${numRolls}`);
		this.numRolls = numRolls;
	}

	static pointValue(placement: "most" | "secondMost") {
		return placement === "most" ? 6 : 3;
	}
}

export class Maki_1 extends Maki {
	constructor() {
		super(1);
	}
}

export class Maki_2 extends Maki {
	constructor() {
		super(2);
	}
}

export class Maki_3 extends Maki {
	constructor() {
		super(3);
	}
}

export class Sashimi extends Card {
	constructor() {
		super("Sashimi");
	}

	static pointValue(numCards: number) {
		return Math.floor(numCards / 3) * 10;
	}
}

export class Dumpling extends Card {
	constructor() {
		super("Dumpling");
	}

	static pointValue(numCards: number) {
		let pointsDistribution: Record<number, number> = { 0:0, 1:1, 2:3, 3:6, 4:10, 5:15 };
		if (numCards > 5) {
			numCards = 5;
		}
		return pointsDistribution[numCards];
	}
}

export class Chopsticks extends Card {
	constructor() {
		super("Chopsticks");
	}

	static pointValue() {
		return 0;
	}
}

export class Wasabi extends Card {
	used: boolean;

	constructor() {
		super("Wasabi");
		this.used = false;
	}

	addNigiri() {
		this.used = true;
	}

	static pointValue() {
		return 0;
	}
}

export class Pudding extends Card {
	constructor() {
		super("Pudding");
	}

	static pointValue(placement: "most" | "least") {
		return placement === "most" ? 6 : -6;
	}
}

export class Nigiri extends Card {
	hasWasabi: boolean;
	points: number;

	constructor(name: string, points: number) {
		super(name);
		this.hasWasabi = false;
		this.points = points;
	}

	pointValue() {
		return this.hasWasabi ? this.points * 3 : this.points;
	}

	addWasabi() {
		this.hasWasabi = true;
	}
}

export class SquidNigiri extends Nigiri {
	constructor() {
		super("Squid Nigiri", 3);
	}
}

export class SalmonNigiri extends Nigiri {
	constructor() {
		super("Salmon Nigiri", 2);
	}
}

export class EggNigiri extends Nigiri {
	constructor() {
		super("Egg Nigiri", 1);
	}
}

export const CARD_PROPERTIES: { [key: string]: { numCards: number, constructor: any, prototype: any } } = {
	"Tempura": {
		numCards: 14,
		constructor: Tempura,
		prototype: Tempura.prototype
	},
	"Sashimi": {
		numCards: 14,
		constructor: Sashimi,
		prototype: Sashimi.prototype
	},
	"Dumpling": {
		numCards: 14,
		constructor: Dumpling,
		prototype: Dumpling.prototype
	},
	"Maki 1": {
		numCards: 6,
		constructor: Maki_1,
		prototype: Maki_1.prototype
	},
	"Maki 2": {
		numCards: 12,
		constructor: Maki_2,
		prototype: Maki_2.prototype
	},
	"Maki 3": {
		numCards: 8,
		constructor: Maki_3,
		prototype: Maki_3.prototype
	},
	"Salmon Nigiri": {
		numCards: 10,
		constructor: SalmonNigiri,
		prototype: SalmonNigiri.prototype
	},
	"Squid Nigiri": {
		numCards: 5,
		constructor: SquidNigiri,
		prototype: SquidNigiri.prototype
	},
	"Egg Nigiri": {
		numCards: 5,
		constructor: EggNigiri,
		prototype: EggNigiri.prototype
	},
	"Pudding": {
		numCards: 10,
		constructor: Pudding,
		prototype: Pudding.prototype
	},
	"Wasabi": {
		numCards: 6,
		constructor: Wasabi,
		prototype: Wasabi.prototype
	},
	"Chopsticks": {
		numCards: 4,
		constructor: Chopsticks,
		prototype: Chopsticks.prototype
	},
}