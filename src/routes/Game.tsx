import { ProtectedPlayer, useSushiGo } from "../contexts/SushiGoContext";
import { SERVER_URI } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";
import PlayerKeptCards from "../components/PlayerKeptCards";
import OpponentsKeptCards from "../components/OpponentsKeptCards";
import { PlayerHand } from "../components/Hands";

const GameOver = ({ players }: { players: Array<ProtectedPlayer>}) => {
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
						<PlayerKeptCards hand={game.player.keptCards} />
						<OpponentsKeptCards players={game.players} />
					</div>
					<PlayerHand hand={game.player.hand} keptCard={game.player.keptCard} />
				</>
				:
				<GameOver players={game.players.concat(game.player)} />
			}
		</div>
	);
}

export default Game;