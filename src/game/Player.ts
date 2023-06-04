import { Card, Nigiri, Wasabi, Chopsticks, Pudding} from "./Cards";

export class Player {
	hand: Array<Card>;
	keptCards: Array<Card>;
	id: string;
	username: string;
	score: number;
	keptCard: boolean;
	hadChopsticks: boolean;

	constructor(id: string, username: string) {
		this.id = id;
		this.username = username;
		this.hand = [];
		this.keptCards = [];
		this.score = 0;
		this.keptCard = false;
		this.hadChopsticks = false;
	}

	keepCard(card: Card) {
		const unusedWasabi = this.keptCards.find(card => card instanceof Wasabi && !card.used) as Wasabi | undefined;
		if (unusedWasabi && card instanceof Nigiri) {
			card.addWasabi();
			unusedWasabi.addNigiri();
		}
		this.keptCards.push(card);
		this.hand = this.hand.filter(c => c !== card);
		this.keptCard = true;
	}

	clearKeptHand() {
		this.keptCards = this.keptCards.filter(c => c instanceof Pudding);
	}

	setHadChopsticks() {
		this.hadChopsticks = false;
		if (this.keptCards.some(c => c instanceof Chopsticks)) {
			this.hadChopsticks = true;
		}
	}
}