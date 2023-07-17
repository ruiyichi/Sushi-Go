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
			if (err || !foundUser._id.equals(decoded.id)) return res.sendStatus(403);
			const accessToken = jwt.sign(
				{
					UserInfo: {
						id: decoded.id,
					}
				},
				process.env.ACCESS_TOKEN_SECRET as Secret,
				{ expiresIn: '1d' }
			);
			res.json({ accessToken, username: foundUser.username, id: foundUser._id, profilePicture: foundUser.profilePicture });
		}
	);
}