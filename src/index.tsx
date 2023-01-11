import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';
import { GameProvider } from './contexts/GameContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<StrictMode>
		<BrowserRouter>
			<SocketProvider>
				<GameProvider>
					<UserProvider>
						<App/>
					</UserProvider>
				</GameProvider>
			</SocketProvider>
		</BrowserRouter>
	</StrictMode>
);
