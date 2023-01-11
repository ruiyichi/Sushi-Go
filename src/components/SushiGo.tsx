import localforage from "localforage";
import { useGame } from "../contexts/GameContext";
import { useUser } from "../contexts/UserContext";
import Lobby from "./Lobby";
import LobbyMenu from "./LobbyMenu";
import Login from "./Login";
import UserInfo from "./UserInfo";
import { useState, useEffect } from "react";

const SushiGo = () => {
	const { user, updateUser } = useUser();
	const { game } = useGame();

	const [settingSavedUser, setSettingSavedUser] = useState(true);

	const setUserFromLocalForage = async () => {
		let savedUser = await localforage.getItem("user");
		if (savedUser) {
			updateUser({ ...savedUser });
		}
		setSettingSavedUser(false);
	}
	
	useEffect(() => {
		setUserFromLocalForage();
	}, []);
	
	return settingSavedUser 
		? 
		<div>Trying to login...</div>
		:
		!user.auth 
			? 
			<Login /> 
			:  
			<div>
				<UserInfo />
					{game.code.length === 0
						?
						<LobbyMenu />
						:
						<Lobby />
					}
			</div>
}

export default SushiGo;