import { Request, Response, NextFunction } from 'express';

const verifyRoles = (...allowedRoles: number[]) => {
	return (req: any, res: Response, next: NextFunction) => {
		if (!req?.roles) return res.sendStatus(401);
		const rolesArray = [...allowedRoles];
		const result = req.roles.map((role: any) => rolesArray.includes(role)).find((val: boolean) => val === true);
		if (!result) return res.sendStatus(401);
		next();
	}
}

export default verifyRoles;