import { MAX_PLAYERS } from "./Settings";

export class Lobby {
  playerIDs: string[];
  maxPlayers: number;

  constructor(playerIDs: string[]=[]) {
    this.playerIDs = playerIDs;
    this.maxPlayers = MAX_PLAYERS;
  }
}