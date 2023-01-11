import { useAuth } from "../contexts/AuthContext";
import LobbyMenu from "./LobbyMenu";
import Login from "./Login";

const SushiGo = () => {
	const { state } = useAuth();
	return !state.auth 
		? 
		<Login /> 
		:  
		<LobbyMenu />
}

export default SushiGo;