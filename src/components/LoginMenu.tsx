import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";

const LoginMenu = () => {
	const navigate = useNavigate();

	return (
		<div className='login-menu'>
			<Logo />
			<div>
				<Button onClick={() => navigate('login')}>
					Log In
				</Button>
				<Button onClick={() => navigate('register')}>
					Sign up
				</Button>
			</div>
		</div>
	);
}

export default LoginMenu;