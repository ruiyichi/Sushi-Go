import localforage from "localforage";
import { useSushiGo } from "../contexts/SushiGoContext";
import Lobby from "./Lobby";
import LobbyMenu from "./LobbyMenu";
import Login from "./Login";
import UserInfo from "./UserInfo";
import Game from "./Game";
import { useState, useEffect } from "react";

const SushiGo = () => {
	const { user, updateUser, game } = useSushiGo();
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
			game.status === "In lobby"
			?
			<div>
				<UserInfo />
					{game.code.length === 0
						?
						<LobbyMenu />
						:
						<Lobby />
					}
			</div>
			:
			<>
				<UserInfo />
				<Game />
			</>
}

export default SushiGo;