import { Opponent, useSushiGo } from "../contexts/SushiGoContext";
import { useNavigate } from "react-router-dom";
import ConveyorBeltContainer from "../components/ConveyorBeltContainer";
import { useEffect, useState } from "react";
import Player from "../components/Player";
import { Player as PlayerClass } from "../game/Player";
import { UserImage } from "../components/User";

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
	const player = game.players.find(player => player.id === user.id) as PlayerClass;

	return player && (
		<div className="game-container">
			<UserImage user={player} />
			<div className="game-header-container">
				<div>
					Round { game.round } - Turn { game.turn } / { game.maxTurns }
				</div>
				<TurnTimer />
			</div>
			
			{game.status === "Pending" 
				?
				<>
					<div className="players-overflow-container">
						<div className="players-container">
							{game.players.map(player => {
								return (
									<Player player={player} />
								)
							})}
						</div>
					</div>
					
					<ConveyorBeltContainer hand={player.hand} keptCard={player.keptCard} />
				</>
				:
				<GameOver players={game.players} />
			}
		</div>
	);
}

export default Game;