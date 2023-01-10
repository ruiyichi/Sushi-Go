import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<BrowserRouter>
			<SocketProvider>
				<AuthProvider>
					<App/>
				</AuthProvider>
			</SocketProvider>
		</BrowserRouter>
	</StrictMode>
);
