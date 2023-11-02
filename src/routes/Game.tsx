import { Opponent, useGame } from "../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import ConveyorBeltContainer from "../components/ConveyorBeltContainer";
import { useEffect, useState } from "react";
import Player from "../components/Player";
import { Player as PlayerClass } from "../game/Player";
import { UserImage } from "../components/User";
import { motion } from "framer-motion";
import MenuButton from "../components/MenuButton";
import Delayed from "../components/Delayed";
import { useSocket } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";

const PregameScreen = () => {
	const { socketRef } = useSocket();
	const { game } = useGame();

	return !game.started ? (
		<Delayed duration={8} onExit={() => {
			socketRef.current?.emit('startGame');
		}}>
			<motion.div 
				className="pregame-screen-container" 
				initial={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
				animate={{ backgroundColor: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)'] }}
				transition={{ duration: 8, times: [0, 5/8, 1] }}
			>
				<div id='messages-container'>
					<Delayed duration={5}>
						<motion.div 
							id='prepare-container'
							initial={{ x: '100%' }}
							animate={{ x: ['100%', '0%', '0%', '0%', '-100%'] }}
							transition={{ duration: 5, times: [0, 0.2, 0.4, 0.9, 1]}}
						>
							<div id='player-previews-container'>
								{game.players.map(p => 
									<UserImage key={p.id} user={p} size={250} />
								)}
							</div>
							<label>
								Prepare!
							</label>
						</motion.div>
					</Delayed>
					<Delayed delay={4}>
						<motion.div
							initial={{ scale: 2, opacity: 0 }}
							animate={{ 
								scale: [2, 2, 2, 3, 7],
								opacity: [0, 0, 1, 1, 0],
							}}
							transition={{ duration: 3, times: [0, 0.5, 0.5, 0.85, 1] }}
						>
							Sushi Go!
						</motion.div>
					</Delayed>
				</div>
			</motion.div>
		</Delayed>
	) : null;
}

const GameOver = ({ players }: { players: Array<Opponent>}) => {
	const navigate = useNavigate();
	const maxScore = Math.max(...players.map(p => p.score));

	return (
		<div className='game-over-container'>
			Player { players.find(p => p.score === maxScore)?.username } wins!
			<MenuButton onClick={() => navigate('/')}>
				Back to main menu
			</MenuButton>
		</div>
	);
}

const TurnTimer = () => {
	const [turnTimer, setTurnTimer] = useState(0);
	const { user } = useUser();
	const { game } = useGame();
	const { socketRef } = useSocket();

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
	const { user } = useUser();
	const { game } = useGame();
	const player = game.players.find(player => player.id === user.id) as PlayerClass;

	return player && (
		<>
			<PregameScreen />
			<motion.div className="game-container">
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
								{game.players.map(player => <Player key={player.id} player={player} />)}
							</div>
						</div>
						
						<ConveyorBeltContainer hand={player.hand} keptCard={player.keptCard} />
					</>
					:
					<GameOver players={game.players} />
				}
			</motion.div>
		</>
	);
}

export default Game;