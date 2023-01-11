import { MAX_PLAYERS, MIN_PLAYERS } from "../game/Settings";
import { useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";

const LobbyMenu = () => {
	const { socket } = useSocket();
	const { user } = useUser();

	const [numPlayers, setNumPlayers] = useState(2);
	const [lobbyCode, setLobbyCode] = useState("");

	const createLobby = (numPlayers: number) => socket.emit(
		'createLobby', 
		{ numPlayers, userID: user.id }, 
		(code: string) => setLobbyCode(code) 
	);

	return (
		<div className="lobby-dialog">
			<div className="create-lobby-container">
				<div className="number-players-container">
					Number of players
					<select value={numPlayers} onChange={e => setNumPlayers(parseInt(e.target.value))}>
						{
							Array.from(new Array(MAX_PLAYERS - MIN_PLAYERS + 1), (x, i) => i + MIN_PLAYERS).map(num_players => {
								return (
									<option key={num_players} value={num_players}>
										{num_players}
									</option>
								);
							})
						}
					</select>
				</div>
				<button onClick={() => createLobby(numPlayers)}>
					Create lobby
				</button>
			</div>
			OR
			<div className="join-lobby-container">
				<input placeholder="Enter code" onBlur={e => setLobbyCode(e.target.value)}/>
				<button onClick={() => {}}>
					Join lobby
				</button>
			</div>
		</div>
	);
}

export default LobbyMenu;