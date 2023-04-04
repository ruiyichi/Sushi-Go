import { MAX_PLAYERS } from "./Settings";

export class Lobby {
  code: string;
  playerIDs: string[];
  maxPlayers: number;

  constructor(code: string, playerIDs: string[]=[]) {
    this.code = code;
    this.playerIDs = playerIDs;
    this.maxPlayers = MAX_PLAYERS;
  }
}