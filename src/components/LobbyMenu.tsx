import { MAX_PLAYERS, MIN_PLAYERS } from "../game/Settings";
import { useState } from "react";
import { useSushiGo } from "../contexts/SushiGoContext";
import { useNavigate } from "react-router-dom";

const LobbyMenu = () => {
	const { socket, user, updateGame } = useSushiGo();
	const [maxPlayers, setMaxPlayers] = useState(2);
	const [gameCode, setGameCode] = useState('');
	const [lobbyMessage, setLobbyMessage] = useState('');

	const navigate = useNavigate();

	const createLobby = (maxPlayers: number) => socket.emit(
		'createLobby', 
		maxPlayers, user.username, (code: string) => {
			updateGame({ code, maxPlayers });
			navigator.clipboard.writeText(code);
			navigate('/lobby');
		}
	);
	
	const joinLobby = () => socket.emit(
		'joinLobby',
		gameCode, user.username, (status: "OK" | "Invalid code" | "Lobby full", maxPlayers: number) => {
			if (status === "OK") {
				updateGame({ code: gameCode, maxPlayers });
			} else {
				setLobbyMessage(status);
			}
			navigate('/lobby');
		}
	);

	return (
		<div className="main-page-container">
			<div className="main-title">
					<div id='inner-border'>
						Sushi Go!
					</div>
			</div>
			<div className="lobby-dialog">
				<div className="create-lobby-container">
					<div className="number-players-container">
						Number of players
						<select value={maxPlayers} onChange={e => setMaxPlayers(parseInt(e.target.value))}>
							{Array.from(new Array(MAX_PLAYERS - MIN_PLAYERS + 1), (x, i) => i + MIN_PLAYERS).map(num_players => {
									return (
										<option key={num_players} value={num_players}>
											{num_players}
										</option>
									);
								})
							}
						</select>
					</div>
					<button onClick={() => createLobby(maxPlayers)}>
						Create lobby
					</button>
				</div>
				OR
				<div className="join-lobby-container">
					<input placeholder="Enter code" onBlur={e => setGameCode(e.target.value)}/>
					<button onClick={joinLobby}>
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