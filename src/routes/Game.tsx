import { Opponent, useSushiGo } from "../contexts/SushiGoContext";
import { SERVER_URI } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";
import { PlayerKeptCards, OpponentsKeptCards } from "../components/PlayerKeptCards";
import { PlayerHand } from "../components/Hands";

const GameOver = ({ players }: { players: Array<Opponent>}) => {
	const navigate = useNavigate();
	const maxScore = Math.max(...players.map(p => p.score));

	return (
		<div className='game-over-container'>
			Player { players.find(p => p.score === maxScore)?.username } wins!
			<button onClick={() => navigate('/')}>
				Back to main menu
			</button>
		</div>
	);
}

const Game = () => {
	const { game, user } = useSushiGo();

	return game.player && (
		<div className="game-container flex column">
			<div className="player-info-container">
				{user.id && 
					<img 
						id='user-image'
						src={`${SERVER_URI}/images/profiles/${user.id}`} 
						alt={user.id}
					/>
				}	
				<div>
					{user.username}
				</div>
			</div>

			<div className="header-container">
				<div>
					Round { game.round } - Turn { game.turn } / { game.maxTurns }
				</div>
				<div>
					{ game.roundStatus }
				</div>
			</div>
			
			{game.status === "Pending" 
				?
				<>
					<div className="played-hands-container">
						<PlayerKeptCards player={game.player} />
						<OpponentsKeptCards players={game.opponents} />
					</div>
					<PlayerHand hand={game.player.hand} keptCard={game.player.keptCard} />
				</>
				:
				<GameOver players={game.opponents.concat(game.player)} />
			}
		</div>
	);
}

export default Game;