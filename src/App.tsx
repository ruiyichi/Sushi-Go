import { useRoutes } from 'react-router-dom';
import Auth from './components/Auth';
import SushiGo from './components/SushiGo';

const App = () => {
	const routes = useRoutes([
		{
			path: '/',
			element: <SushiGo />
		},
		{
			path: '/auth',
			element: <Auth />
		}
	]);
	return routes;
}

export default App;