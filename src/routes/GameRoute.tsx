import { Navigate } from 'react-router-dom';
import { useSushiGo } from '../contexts/SushiGoContext';
import Game from './Game';

const GameRoute = () => {
  const { game } = useSushiGo();
  
	if (game.player) {
		return <Game />;
	} else {
		return <Navigate to="/" />;
	}
}

export default GameRoute;