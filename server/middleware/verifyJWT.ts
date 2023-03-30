import jwt, { Secret } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const authHeaderString = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!authHeaderString?.startsWith('Bearer ')) return res.sendStatus(401);
  
	const token = authHeaderString.split(' ')[1];
  console.log(token);

  jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as Secret,
		(err: any, decoded: any) => {
			if (err) return res.sendStatus(403); //invalid token
			req.username = decoded.UserInfo.username;
			next();
		}
	);
};

export default verifyJWT;