import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './routes/Login';
import Register from './routes/Register';
import Unauthorized from './routes/Unauthorized';
import Home from './routes/Home';
import Missing from './routes/Missing';
import RequireAuth from './routes/RequireAuth';
import PersistLogin from './routes/PersistLogin';
import LobbyRoute from './routes/LobbyRoute';
import GameRoute from './routes/GameRoute';

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="register" element={<Register />} />
				<Route path="unauthorized" element={<Unauthorized />} />

				<Route element={<PersistLogin />}>
					<Route path="/" element={<Home />} />
					<Route path="login" element={<Login />} />
					<Route element={<RequireAuth />}>
						<Route path="game" element={<GameRoute />} />
						<Route path="lobby/*" element={<LobbyRoute />} />
					</Route>
				</Route>

				<Route path="*" element={<Missing />} />
			</Route>
		</Routes>
	);
}

export default App;