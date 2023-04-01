import UserInfo from "./UserInfo";
import LobbyMenu from "./LobbyMenu";

const Home = () => {
	return (
		<div className='home'>
			<UserInfo />
			<LobbyMenu />
		</div>
	);
}

export default Home;