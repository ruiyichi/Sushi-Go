import { Card, Nigiri, Wasabi, Tempura, Maki, Chopsticks, Pudding, Sashimi, Dumpling} from "./Cards";

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

  static sort(cards: Array<Card>) {
    const sortingArray = [Maki.name, Dumpling.name, Sashimi.name, Tempura.name, Nigiri.name, Pudding.name, Chopsticks.name];
    return cards.sort((a, b) => sortingArray.indexOf(a.constructor.name) - sortingArray.indexOf(b.constructor.name));
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