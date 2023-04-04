import User from "../model/User";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

export const handleLogin = async (req: Request, res: Response) => {
	const { username, pwd } = req.body;
	if (!username || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

	const foundUser = await User.findOne({ username }).exec();
	if (!foundUser) return res.sendStatus(401);
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		const accessToken = jwt.sign(
			{
				UserInfo: {
					id: foundUser._id,
				}
			},
			process.env.ACCESS_TOKEN_SECRET as Secret,
			{ expiresIn: '10s' }
		);
		const refreshToken = jwt.sign(
			{ id: foundUser._id },
			process.env.REFRESH_TOKEN_SECRET as Secret,
			{ expiresIn: '1d' }
		);

		await User.updateOne({ username }, { refreshToken });

		res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
		res.json({ accessToken, id: foundUser._id });

	} else {
		res.sendStatus(401);
	}
}