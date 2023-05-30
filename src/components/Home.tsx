import LobbyMenu from "./LobbyMenu";
import LoginMenu from "./LoginMenu";
import UserInfo from "./UserInfo";
import { useSushiGo } from "../contexts/SushiGoContext";
import BaseScreen from "../routes/BaseScreen";

const Home = () => {
	const { user } = useSushiGo();

	return (
		<div className='home'>
			<BaseScreen>
				{ user.username && <UserInfo /> }
				{user.username
					?
						<LobbyMenu />
					:
						<LoginMenu />
				}
			</BaseScreen>
		</div>
	);
}

export default Home;