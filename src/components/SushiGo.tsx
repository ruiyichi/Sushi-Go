import { useUser } from "../contexts/UserContext";
import LobbyMenu from "./LobbyMenu";
import Login from "./Login";
import Title from "./Title";
import UserInfo from "./UserInfo";

const SushiGo = () => {
	const { user } = useUser();
	
	return !user.auth 
		? 
		<Login /> 
		:  
		<div>
			<UserInfo />
			<div className="main-page-container">
				<Title />
				<LobbyMenu />
			</div>
		</div>
}

export default SushiGo;