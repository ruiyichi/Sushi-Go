import Game from './Game';
import { Navigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';

const GameRoute = () => {
  const { user } = useUser();
	const { game } = useGame();
	const player = game.players.find(player => player.id === user.id);
  
	if (player) {
		return <Game />;
	}
	
	return <Navigate to="/" />;
}

export default GameRoute;