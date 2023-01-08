import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { AuthProvider } from './contexts/Auth';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App/>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
