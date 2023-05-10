import { ProtectedPlayer, useSushiGo } from "../contexts/SushiGoContext";
import { PlayerHand, PlayerKeptHand } from "../components/Hands";
import { SERVER_URI } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";
import { Player } from "../game/Player";
import { memo } from "react";

const GameOver = ({ players }: { players: Array<ProtectedPlayer>}) => {
	const navigate = useNavigate();
	const maxScore = Math.max(...players.map(p => p.score));

	return (
		<div>
			Player { players.find(p => p.score === maxScore)?.id } wins!
			<button onClick={() => navigate('/')}>
				Back to main menu
			</button>
		</div>
	);
}

const PlayerHands = memo(({ player }: { player: Player | null }) => {
	console.log('rerender')
	return player && (
		<div>
			<PlayerHand hand={player.hand} keptCard={player.keptCard} />
			<PlayerKeptHand hand={player.keptHand} />
		</div>
	);
});

const Game = () => {
	const { game, user } = useSushiGo();

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
				<PlayerHands player={game.player} />
				:
				<GameOver players={game.players} />
			}
		</div>
	);
}

export default Game;