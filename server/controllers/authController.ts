import User from "../model/User";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

export const handleLogin = async (req: Request, res: Response) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

	const foundUser = await User.findOne({ username: user }).exec();
	if (!foundUser) return res.sendStatus(401);
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		const roles = Object.values(foundUser.roles).filter(Boolean);
		const accessToken = jwt.sign(
			{
				"UserInfo": {
					"username": foundUser.username,
					"roles": roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET as Secret,
			{ expiresIn: '10s' }
		);
		const refreshToken = jwt.sign(
			{ "username": foundUser.username },
			process.env.REFRESH_TOKEN_SECRET as Secret,
			{ expiresIn: '1d' }
		);

		await User.updateOne({ username: user }, { refreshToken });

		res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 }); // secure: true,
		res.json({ accessToken });

	} else {
		res.sendStatus(401);
	}
}