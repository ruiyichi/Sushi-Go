import User from '../model/User';
import jwt, { Secret } from 'jsonwebtoken';
import { Response, Request } from "express";

export const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	
	const refreshToken = cookies.jwt;
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET as Secret,
		(err: any, decoded: any) => {
			if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: decoded.username,
					}
				},
				process.env.ACCESS_TOKEN_SECRET as Secret,
				{ expiresIn: '10s' }
			);
			res.json({ accessToken, username: foundUser.username });
		}
	);
}