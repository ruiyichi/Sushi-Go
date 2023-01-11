import { MAX_PLAYERS, MIN_PLAYERS } from "../Game/Settings";
import { useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import { useGame } from "../contexts/GameContext";

const LobbyMenu = () => {
	const { socket } = useSocket();
	const { user } = useUser();
	const { updateGame } = useGame();

	const [numPlayers, setNumPlayers] = useState(2);
	const [gameCode, setGameCode] = useState('');
	const [lobbyMessage, setLobbyMessage] = useState('');

	const createLobby = (numPlayers: number) => socket.emit(
		'createLobby', 
		numPlayers, user.id, (code: string) => updateGame({ code })
	);
	
	const joinLobby = () => socket.emit(
		'joinLobby',
		gameCode, user.id, (status: "OK" | "Invalid code" | "Lobby full") => {
			if (status === "OK") {
				updateGame({ code: gameCode });
			}
			else {
				setLobbyMessage(status);
			}
		}
	);

	return (
		<div className="main-page-container">
			<div className="main-title">
				Sushi Go
			</div>
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
					<input placeholder="Enter code" onBlur={e => setGameCode(e.target.value)}/>
					<button onClick={() => joinLobby()}>
						Join lobby
					</button>
					<div id="lobby-message">
						{lobbyMessage}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LobbyMenu;