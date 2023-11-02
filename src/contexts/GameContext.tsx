import { createContext, useContext, useReducer } from "react";
import { Player } from "../game/Player";
import { Card } from "../game/Cards";

const GameContext = createContext({} as GameContextValue);

export type Opponent = {
	id: string,
	username: string,
	keptCards: Card[],
	score: number,
};

type GameContextValue = { 
	game: Game,
	updateGame: React.Dispatch<any>,
};

export type Game = {
	status: "In lobby" | "Pending" | "Completed",
	players: Array<Player | Opponent>,
	turn: number,
	round: number,
	maxTurns: number,
	maxRounds: number,
	started: boolean,
};

const defaultGameState = {
	status: "In lobby",
	players: [],
	turn: 0,
	round: 0,
	maxTurns: 0,
	maxRounds: 0,
	started: false
} as Game;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const gameReducer = (game: Game, payload: Game) => {
		const castPlayerCardsToInstance = (player: Player | Opponent) => {
			if ('hand' in player) {
				player.hand = player.hand.map(c => Card.castToInstance(c));
			}
			if (player.keptCards) {
				player.keptCards = player.keptCards.map(c => Card.castToInstance(c));
			}
		}
		if (payload.players) {
			for (let player of payload.players) {
				castPlayerCardsToInstance(player);
			}
		}
		return { ...game, ...payload };
	}
	const [game, updateGame] = useReducer(gameReducer, defaultGameState);

	const value: GameContextValue = { 
		game,
		updateGame
	};

	return (
		<GameContext.Provider value={value}>
			{children}
		</GameContext.Provider>
	);
}

export const useGame = () => useContext(GameContext);