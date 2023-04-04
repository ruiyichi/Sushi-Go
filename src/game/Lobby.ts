import { MAX_PLAYERS } from "./Settings";
import { BasicUser } from "../interfaces";

export class Lobby {
  code: string;
  players: BasicUser[];
  maxPlayers: number;

  constructor(code: string, players: BasicUser[]=[]) {
    this.code = code;
    this.players = players;
    this.maxPlayers = MAX_PLAYERS;
  }
}