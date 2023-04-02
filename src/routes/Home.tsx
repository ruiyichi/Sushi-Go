import UserInfo from "../components/UserInfo";
import LobbyMenu from "../components/LobbyMenu";
import { useSushiGo } from "../contexts/SushiGoContext";
import Logo from "../components/Logo";
import LoginMenu from "../components/LoginMenu";

const Home = () => {
	const { user } = useSushiGo();
	
	return (
		<div className='home'>
			<UserInfo />
			<Logo />
			{user.username
				?
					<LobbyMenu />
				:
					<LoginMenu />
			}
		</div>
	);
}

export default Home;