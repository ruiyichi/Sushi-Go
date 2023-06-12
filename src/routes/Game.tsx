import { Opponent, useSushiGo } from "../contexts/SushiGoContext";
import { SERVER_URI } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";
import { PlayerKeptCards, OpponentsKeptCards } from "../components/PlayerKeptCards";
import PlayerHand from "../components/PlayerHand";
import { useEffect, useState } from "react";
import { Player } from "../game/Player";

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

const TurnTimer = () => {
	const [turnTimer, setTurnTimer] = useState(0);
	const { user, game, socketRef } = useSushiGo();

	useEffect(() => {
		socketRef.current?.on("setTurnTimer", payload => setTurnTimer(payload));
		socketRef.current?.emit("getTurnTimer");
	}, [user.accessToken, socketRef.current, game.round, game.turn]);

	return (
		<div>
			{ game.status === 'Completed' ? '' : 
			 `${(turnTimer > 10000 ? Math.floor(turnTimer / 1000) : (Math.trunc(turnTimer * Math.pow(0.1, 1)) / Math.pow(100, 1)).toFixed(1))} seconds remaining`}
		</div>
	);
}

const Game = () => {
	const { game, user } = useSushiGo();
	const player = game.players.find(player => player.id === user.id) as Player;
	const opponents = game.players.filter(p => p !== player);

	return player && (
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
				<TurnTimer />
			</div>
			
			{game.status === "Pending" 
				?
				<>
					<div className="played-hands-container">
						<PlayerKeptCards player={player} />
						<OpponentsKeptCards opponents={opponents} />
					</div>
					<PlayerHand hand={player.hand} keptCard={player.keptCard} />
				</>
				:
				<GameOver players={game.players} />
			}
		</div>
	);
}

export default Game;