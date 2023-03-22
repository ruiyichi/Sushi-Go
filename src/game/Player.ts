import { Card, Nigiri, Wasabi } from "./Cards";

export class Player {
  hand: Array<Card>;
  keptHand: Array<Card>;
  id: string;
  score: number;
  keptCard: boolean;
  hadChopsticks: boolean;

  constructor(id: string) {
    this.id = id;
    this.hand = [];
    this.keptHand = [];
    this.score = 0;
    this.keptCard = false;
    this.hadChopsticks = false;
  }

  keepCard(card: Card) {
    const unusedWasabi = this.keptHand.find(card => card instanceof Wasabi && !card.used) as Wasabi | undefined;
    if (unusedWasabi && card instanceof Nigiri) {
      card.addWasabi();
      unusedWasabi.addNigiri();
    }
    this.keptHand.push(card);
    this.hand = this.hand.filter(c => c !== card);
    this.keptCard = true;
  }

  clearKeptHand() {
    this.keptHand = this.keptHand.filter(c => c.name === 'Pudding');
  }

  setHadChopsticks() {
    this.hadChopsticks = false;
    if (this.keptHand.some(card => card.name === 'Chopsticks')) {
      this.hadChopsticks = true;
    }
  }
}