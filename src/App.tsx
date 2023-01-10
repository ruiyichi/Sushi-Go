import Lobby from './components/Lobby';
import Login from './components/Login';
import { useRoutes, Outlet } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Auth from './components/Auth';

const App = () => {
	const routes = useRoutes([
		{
			path: '/',
			element: <Outlet />,
			children: [
				{
					index: true,
					element: (
						<AuthenticatedRoute>
							<MainPage />
						</AuthenticatedRoute>
					)
				},
				{
					path: '/login',
					element: <Login />
				},
				{
					path: '/lobby',
					element: (
						<AuthenticatedRoute>
							<Lobby />
						</AuthenticatedRoute>
					)
				},
				{
					path: '/auth',
					element: <Auth />
				}
			]
		},
	])
	return routes;
}

export default App;