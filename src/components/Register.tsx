import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { isAxiosError } from 'axios';
import { Link } from "react-router-dom";

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
				<div>
					<div ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</div>
					<div>Register</div>
					<form onSubmit={handleSubmit}>
						<label htmlFor="username">
							Username:
						</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={e => setUsername(e.target.value)}
							value={username}
							required
						/>
						
						<label>
							Password:
						</label>
						<input
							type="password"
							id="password"
							onChange={e => setPwd(e.target.value)}
							value={pwd}
							required
						/>
						<label>
							Confirm Password:
						</label>
						<input
							type="password"
							id="confirm_pwd"
							onChange={e => setMatchPwd(e.target.value)}
							value={matchPwd}
							required
						/>
						<button>Sign Up</button>
					</form>
					<div>
						Already registered?
						<div>
							<Link to="/">Sign In</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Register;