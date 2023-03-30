import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import Game from './components/Game';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import Lobby from './components/Lobby';
import PersistLogin from './components/PersistLogin';

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="unauthorized" element={<Unauthorized />} />

				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth />}>
						<Route path="/" element={<Home />} />
						<Route path="game" element={<Game />} />
						<Route path="lobby" element={<Lobby />} />
					</Route>
				</Route>

				<Route path="*" element={<Missing />} />
			</Route>
		</Routes>
	);
}

export default App;