import LobbyMenu from "./LobbyMenu";
import LoginMenu from "./LoginMenu";
import BaseScreen from "../routes/BaseScreen";
import { useUser } from "../contexts/UserContext";

const Home = () => {
	const { user } = useUser();

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