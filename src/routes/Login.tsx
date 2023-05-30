import { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { isAxiosError } from 'axios';
import { useSushiGo } from '../contexts/SushiGoContext';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Button from '../components/Button';
import BaseScreen from './BaseScreen';
import Logo from '../components/Logo';

const LOGIN_URL = '/auth';

const Login = () => {
	const { user, updateUser, persist, setPersist } = useSushiGo();

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
			const { accessToken, id } = response.data;
			updateUser({ id, username, accessToken });
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
		user.username
		? 
			<Navigate to={"/"} />
		: 
			<BaseScreen>
				<div className='login-page-container'>
					<Logo />
					<div className='login-container'>
						<div ref={errRef} className={errMsg ? "error" : "hidden"}>{errMsg}</div>
						<form onSubmit={handleSubmit}>
							<div>
								<div className='user-login-info-container'>
									Username:
									<input 
										type='text'
										id='username'
										ref={usernameRef}
										onChange={(e => setUsername(e.target.value))}
										value={username}
										required
										placeholder='Username'
									/>
								</div>
								
								<div className='user-login-info-container'>
									Password:
									<input
										type='password'
										id='password'
										onChange={e => setPwd(e.target.value)}
										value={pwd}
										required
										placeholder='Password'
									/>
								</div>
								
								<div>
									Stay signed in
									<input 
										type='checkbox'
										id='persist'
										onChange={() => setPersist((prev: boolean) => !prev)}
										value={persist}
									/>
								</div>
							</div>
							
							<Button>Go!</Button>
						</form>
					</div>
				</div>
			</BaseScreen>
	);
}

export default Login;