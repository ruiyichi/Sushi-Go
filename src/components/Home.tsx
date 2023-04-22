import LobbyMenu from "./LobbyMenu";
import LoginMenu from "./LoginMenu";
import Logo from "./Logo";
import UserInfo from "./UserInfo";
import { useSushiGo } from "../contexts/SushiGoContext";
import Background from "./3d/Background";

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
					<Background />
			}
		</div>
	);
}

export default Home;