import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { SushiGoProvider } from './contexts/SushiGoContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<StrictMode>
		<BrowserRouter>
			<SushiGoProvider>
				<App/>
			</SushiGoProvider>
		</BrowserRouter>
	</StrictMode>
);
