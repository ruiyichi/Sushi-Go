import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { SushiGoProvider } from './contexts/SushiGoContext';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') {
	disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<StrictMode>
		<BrowserRouter>
			<SushiGoProvider>
				<Routes>
					<Route path="/*" element={<App />} />
				</Routes>
			</SushiGoProvider>
		</BrowserRouter>
	</StrictMode>
);
