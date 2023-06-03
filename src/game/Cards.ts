export class Card {
	name: string;
	type: string;

	constructor(name: string, type?: string) {
		this.name = name;
		this.type = type || name;
	}

	static pointValue(...params: any) {
		return 0;
	}

	pointValue(...params: any) {
		return 0;
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
		super(`Maki ${numRolls}`, "Maki");
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
		let pointsDistribution: { [key: number]: number } = { 0:0, 1:1, 2:3, 3:6, 4:10, 5:15 };
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
		super(name, "Nigiri");
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
