import User from '../model/User';
import { Request, Response } from "express";

export const handleLogout = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
		return res.sendStatus(204);
	}

	foundUser.refreshToken = '';
	const result = await foundUser.save();
	console.log(result);

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
	res.sendStatus(204);
}