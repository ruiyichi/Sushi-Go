import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

const Login = () => {
	const { state, dispatch } = useAuth();
	const navigate = useNavigate();

	return (
		<div>
			Login
			<div>
				<button
					onClick={() => {
						dispatch({ type: state.auth ? 'logout' : 'login' });
						navigate('/', { replace: true });
					}}
				>
					{ state.auth ? 'Log out' : 'Login' }
				</button>
			</div>
		</div>
	);
}

export default Login;