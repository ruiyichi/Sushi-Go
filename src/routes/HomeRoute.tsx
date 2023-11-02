import { useGame } from "../contexts/GameContext";
import { Navigate } from "react-router-dom";
import Home from "../components/Home";

const HomeRoute = () => {
	const { game } = useGame();

	return game.status === "Pending"
	? 
		<Navigate to="/game" />
	:
		<Home />
}

export default HomeRoute;