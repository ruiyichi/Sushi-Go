import { useEffect } from "react";
import { useSushiGo } from "../contexts/SushiGoContext";
import { Navigate } from "react-router-dom";
import Home from "../components/Home";

const HomeRoute = () => {
	const { user, game, getUpdatedGame } = useSushiGo();

	useEffect(() => {
		getUpdatedGame();
	}, [user.username]);

	return game.status === 'In progress' 
	? 
		<Navigate to={"/game"} />
	:
		<Home />
}

export default HomeRoute;