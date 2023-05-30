import { useNavigate } from "react-router-dom";
import BaseScreen from "../routes/BaseScreen";
import Logo from "./Logo";
import Button from "./Button";

const LoginMenu = () => {
	const navigate = useNavigate();

	return (
		<BaseScreen>
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
		</BaseScreen>
	);
}

export default LoginMenu;