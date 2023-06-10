import { Opponent, useSushiGo } from "../contexts/SushiGoContext";
import { SERVER_URI } from "../CONSTANTS";
import { useNavigate } from "react-router-dom";
import { PlayerKeptCards, OpponentsKeptCards } from "../components/PlayerKeptCards";
import PlayerHand from "../components/PlayerHand";
import { useEffect, useState } from "react";

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
	}, [user.accessToken, socketRef.current]);

	useEffect(() => {
		if (turnTimer > 0 && game.status !== 'Completed') {
			const interval = setInterval(() => {
				setTurnTimer(turnTimer - 100);
			}, 100);

			return () => clearInterval(interval);
		}
	}, [turnTimer]);

	return (
		<div>
			{ turnTimer > 10000 ? Math.floor(turnTimer / 1000) : (Math.trunc(turnTimer * Math.pow(0.1, 1)) / Math.pow(100, 1)).toFixed(1) } seconds remaining
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
				<TurnTimer />
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