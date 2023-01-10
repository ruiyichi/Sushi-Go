import { OAUTH_URL } from "../CONSTANTS";

const Login = () => {
	return (
		<div>
			Login
			<div>
				<a href={OAUTH_URL}>Login with discord</a>
			</div>
		</div>
	);
}

export default Login;