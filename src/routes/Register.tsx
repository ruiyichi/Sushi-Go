import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { isAxiosError } from 'axios';
import BaseScreen from "./BaseScreen";
import Button from "../components/Button";
import Logo from "../components/Logo";

const REGISTER_URL = '/register';

const Register = () => {
	const userRef = useRef<HTMLInputElement | null>(null);
	const errRef = useRef<HTMLInputElement | null>(null);

	const [username, setUsername] = useState('');

	const [pwd, setPwd] = useState('');

	const [matchPwd, setMatchPwd] = useState('');

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef?.current?.focus();
	}, [])

	useEffect(() => {
		setErrMsg('');
	}, [username, pwd, matchPwd])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await axios.post(REGISTER_URL,
				JSON.stringify({ username, pwd }),
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			);
			setSuccess(true);
			setUsername('');
			setPwd('');
			setMatchPwd('');
		} catch (err) {
			if (isAxiosError(err)) {
				if (!err.response) {
					setErrMsg('No Server Response');
				} else if (err.response?.status === 409) {
					setErrMsg('Username Taken');
				} else {
					setErrMsg('Registration Failed')
				}
				errRef?.current?.focus();
			}
		}
	}

	return (
		<>
			{success ? (
				<div>
					<div>Success!</div>
					<div>
						<a href="/">Sign In</a>
					</div>
				</div>
			) : (
				<BaseScreen>
					<div className='register-page-container'>
						<Logo />
						<div className='register-container'>
							<div ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</div>
							<form onSubmit={handleSubmit}>
								<div>
									<div>
										<label htmlFor='username'>
											Username:
										</label>
										<input
											type='text'
											ref={userRef}
											autoComplete='off'
											onChange={e => setUsername(e.target.value)}
											value={username}
											required
											placeholder='Username'
										/>
									</div>

									<div>
										<label htmlFor='password'>
											Password:
										</label>
										<input
											type='password'
											onChange={e => setPwd(e.target.value)}
											value={pwd}
											required
											placeholder='Password'
										/>
									</div>

									<div>
										<label>
											Confirm Password:
										</label>
										<input
											type='password'
											onChange={e => setMatchPwd(e.target.value)}
											value={matchPwd}
											required
											placeholder='Confirm password'
										/>
									</div>
								</div>
								
								<Button>Go!</Button>
							</form>
						</div>
					</div>
				</BaseScreen>
			)}
		</>
	);
}

export default Register;