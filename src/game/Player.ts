import { Card } from "./Cards";

export class Player {
  hand: Array<Card>;
  keptHand: Array<Card>;
  id: string;
  score: number;

  constructor(id: string) {
    this.id = id;
    this.hand = [];
    this.keptHand = [];
    this.score = 0;
  }

  keepCard(card: Card) {
    this.keptHand.push(card);
    this.hand = this.hand.filter(c => c !== card);
  }
}