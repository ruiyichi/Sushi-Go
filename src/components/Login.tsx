import { OAUTH_URL } from "../CONSTANTS";

const Login = () => {
	return (
		<div className='login-page-container'>
			<div className='login-container'>
				<div className='title'>
					Welcome to Sushi Go!
				</div>
				<a href={OAUTH_URL}>Login with discord</a>
			</div>
		</div>
	);
}

export default Login;