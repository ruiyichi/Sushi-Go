import LobbyMenu from "./LobbyMenu";
import LoginMenu from "./LoginMenu";
import Logo from "./Logo";
import UserInfo from "./UserInfo";
import { useSushiGo } from "../contexts/SushiGoContext";

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