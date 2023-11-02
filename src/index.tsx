import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { SocketProvider } from './contexts/SocketContext';
import { LobbyProvider } from './contexts/LobbyContext';
import { UserProvider } from './contexts/UserContext';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') {
	disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<BrowserRouter>
		<GameProvider>
			<LobbyProvider>
				<UserProvider>
					<SocketProvider>
						<App />
					</SocketProvider>
				</UserProvider>
			</LobbyProvider>
		</GameProvider>
	</BrowserRouter>
);
