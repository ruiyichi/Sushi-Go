type IObject = { [key: number]: number };

export class Card {
	name: String;

	constructor(name: String) {
		this.name = name;
	}
}

export class Tempura extends Card {
	constructor() {
		super("Tempura");
	}

	pointValue(numCards: number) {
		return Math.floor(numCards / 2) * 5;
	}
}

export class Maki extends Card {
	numRolls: number;
	constructor(numRolls: number) {
		super(`Maki ${numRolls}`);
		this.numRolls = numRolls;
	}

	pointValue(placement: "most" | "secondMost") {
		return placement === "most" ? 6 : 3;
	}
}

export class Sashimi extends Card {
	constructor() {
		super("Sashimi");
	}

	pointValue(numCards: number) {
		return Math.floor(numCards / 3) * 10;
	}
}

export class Dumpling extends Card {
	constructor() {
		super("Dumpling");
	}

	pointValue(numCards: number) {
		let pointsDistribution = { 0:0, 1:1, 2:3, 3:6, 4:10, 5:15 } as IObject;
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

	pointValue() {
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

	pointValue() {
		return 0;
	}
}

export class Pudding extends Card {
	constructor() {
		super("Pudding");
	}

	pointValue(placement: "most" | "least") {
		return placement === "most" ? 6 : -6;
	}
}

export class Nigiri extends Card {
	hasWasabi: boolean;
	points: number;

	constructor(name: String, points: number) {
		super(name);
		this.hasWasabi = false;
		this.points = points;
	}

	pointValue() {
		return this.hasWasabi ? this.points : this.points * 3;
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
