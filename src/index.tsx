import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<BrowserRouter>
			<SocketProvider>
				<UserProvider>
					<App/>
				</UserProvider>
			</SocketProvider>
		</BrowserRouter>
	</StrictMode>
);
