import { createContext, useContext, useReducer } from "react";

const GameContext = createContext({} as GameContextInterface);

interface GameContextInterface { 
	game: Game,
	updateGame: React.Dispatch<any>
};
interface GameProviderProps { children: React.ReactNode };

interface Game {
	code: string,
};

export const GameProvider = ({ children }: GameProviderProps) => {
	const reducer = (game: Game, payload: Game) => {
		return { ...game, ...payload };
	}

	const [game, updateGame] = useReducer(reducer, { code: '' } as Game);

	const value: GameContextInterface = { 
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