import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { isAxiosError } from 'axios';
import { useSushiGo } from '../contexts/SushiGoContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LOGIN_URL = '/auth';

const Login = () => {
	const { updateUser } = useSushiGo();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location?.state?.from?.pathname || '/';

	const usernameRef = useRef<HTMLInputElement | null>(null);
	const errRef = useRef<HTMLInputElement | null>(null);

	const [username, setUsername] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');

	useEffect(() => {
		usernameRef?.current?.focus();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await axios.post(LOGIN_URL,
				JSON.stringify({ username, pwd }),
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);

			const accessToken = response?.data?.accessToken;
			updateUser({ username, pwd, accessToken });
			setUsername('');
			setPwd('');

			navigate(from, { replace: true });
		} catch (err) {
			if (isAxiosError(err)) {
				if (!err.response) {
					setErrMsg('No server response');
				} else if (err.response?.status === 400) {
					setErrMsg('Missing username or password');
				} else if (err.response?.status === 401) {
					setErrMsg('Invalid username/password');
				} else {
					setErrMsg('Login failed');
				}
				errRef?.current?.focus();
			}
		}
	}

	return (
		<div className='login-page-container'>
			<div className='login-container'>
				<div className='title'>
					Welcome to Sushi Go!
				</div>
				<div ref={errRef} className={errMsg ? "error" : "hidden"}>{errMsg}</div>
				<form id='login-form' onSubmit={handleSubmit}>
					<label>Username:</label>
					<input 
						type='text'
						id='username'
						ref={usernameRef}
						onChange={(e => setUsername(e.target.value))}
						value={username}
						required
					/>
					<label>Password:</label>
					<input
						type='password'
						id='password'
						onChange={e => setPwd(e.target.value)}
						value={pwd}
						required
					/>
					<button>Sign in</button>
				</form>
				<div>
					<Link to='/register'>Sign up</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;