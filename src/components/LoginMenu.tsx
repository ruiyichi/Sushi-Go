import { useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";

const LoginMenu = () => {
	const navigate = useNavigate();

	return (
		<div id='login-menu-container'>
			<MenuButton onClick={() => navigate('login')}>
				Log In
			</MenuButton>
			<MenuButton onClick={() => navigate('register')}>
				Sign up
			</MenuButton>
		</div>
	);
}

export default LoginMenu;