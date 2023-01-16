import { Card } from "./Cards";

export class Player {
  hand: Array<undefined | Card>;
  keptHand: Array<Card>;
  id: String;
  score: Number;

  constructor(id: String) {
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