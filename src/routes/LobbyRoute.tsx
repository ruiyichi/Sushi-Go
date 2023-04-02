import { useLocation, Navigate } from 'react-router-dom';
import Lobby from './Lobby';

const LobbyRoute = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const code = queryParams.get('code');
	
	if (code) {
		return <Lobby code={code} />;
	} else {
		return <Navigate to="/" />;
	}
}

export default LobbyRoute;