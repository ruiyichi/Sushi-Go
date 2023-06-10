import { useSushiGo } from "../contexts/SushiGoContext";
import { Navigate } from "react-router-dom";
import Home from "../components/Home";

const HomeRoute = () => {
	const { game } = useSushiGo();

	return game.status === 'Pending' 
	? 
		<Navigate to={"/game"} />
	:
		<Home />
}

export default HomeRoute;