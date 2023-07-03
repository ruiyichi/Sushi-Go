import LobbyMenu from "./LobbyMenu";
import LoginMenu from "./LoginMenu";
import { useSushiGo } from "../contexts/SushiGoContext";
import BaseScreen from "../routes/BaseScreen";

const Home = () => {
	const { user } = useSushiGo();

	return (
		<BaseScreen id='home'>
			<div>
				{user.username
					?
						<LobbyMenu />
					:
						<LoginMenu />
				}
			</div>
		</BaseScreen>
	);
}

export default Home;