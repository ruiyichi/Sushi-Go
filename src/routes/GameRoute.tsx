import { Navigate } from 'react-router-dom';
import { useSushiGo } from '../contexts/SushiGoContext';
import Game from './Game';

const GameRoute = () => {
  const { user, game } = useSushiGo();
	const player = game.players.find(player => player.id === user.id);
  
	if (player) {
		return <Game />;
	} else {
		return <Navigate to="/" />;
	}
}

export default GameRoute;