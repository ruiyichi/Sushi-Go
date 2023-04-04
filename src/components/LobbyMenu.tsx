import { useState } from "react";
import { useSushiGo } from "../contexts/SushiGoContext";
import { useNavigate } from "react-router-dom";

const LobbyMenu = () => {
	const { socketRef, user } = useSushiGo();
	const [gameCode, setGameCode] = useState('');
	const [lobbyMessage, setLobbyMessage] = useState('');

	const navigate = useNavigate();

	const { id, username } = user;

	const createLobby = () => socketRef.current?.emit(
		'createLobby', { id, username }, 
		(code: string) => {
			navigator.clipboard.writeText(code);
			navigate(`lobby?code=${code}`);
		}
	);
	
	const joinLobby = () => socketRef.current?.emit(
		'joinLobby', gameCode, { id, username }, 
		(status: "OK" | "Invalid code" | "Lobby full") => {
			if (status !== "OK") {
				setLobbyMessage(status);
			}
			navigate(`lobby?code=${gameCode}`);
		}
	);

	return (
		<div className="main-page-container">
			<div className="lobby-dialog">
				<div className="create-lobby-container">
					<button onClick={() => createLobby()}>
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