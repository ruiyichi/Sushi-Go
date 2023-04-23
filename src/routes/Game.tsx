import { useSushiGo } from "../contexts/SushiGoContext";
import { PlayerHand, PlayerKeptHand } from "../components/Hands";
import { SERVER_URI } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";

const Game = () => {
	const { game, user } = useSushiGo();
	const navigate = useNavigate();

	const GameOver = () => {
		const maxScore = Math.max(...game.players.map(p => p.score));

		return (
			<div>
				Player { game.players.find(p => p.score === maxScore)?.id } wins!
				<button onClick={() => navigate('/')}>
					Back to main menu
				</button>
			</div>
		);
	}

	const PendingGame = () => {
		return game.player && (
			<div>
				<PlayerHand hand={game.player.hand} keptCard={game.player.keptCard} />
				<PlayerKeptHand hand={game.player.keptHand} />
			</div>
		);
	}

	return game.player && (
		<div className="game-container">
			<div className="player-info-container">
				{user.id && 
					<img 
						src={`${SERVER_URI}/images/profiles/${user.id}`} 
						alt={user.id}
					/>
				}	
				<div>
					{user.username}
				</div>
				<div>
					Score: {game.player.score}
				</div>
			</div>

			<div className="header-container">
				Round { game.round } - Turn { game.turn } / { game.maxTurns } | { game.roundStatus }
			</div>
			
			{game.status === "Pending" 
				?
				<PendingGame />
				:
				<GameOver />
			}
		</div>
	);
}

export default Game;