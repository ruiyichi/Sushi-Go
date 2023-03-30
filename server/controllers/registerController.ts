import User from '../model/User';
import bcrypt from 'bcrypt';
import { Response, Request } from "express";

export const handleNewUser = async (req: Request, res: Response) => {
	const { username, pwd } = req.body;
	if (!username || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

	// check for duplicate usernames in the db
	const duplicate = await User.findOne({ username }).exec();
	if (duplicate) return res.sendStatus(409); //Conflict 

	try {
		const hashedPwd = await bcrypt.hash(pwd, 10);

		const result = await User.create({
			username,
			password: hashedPwd
		});

		console.log(result);

		res.status(201).json({ success: `New username ${username} created!` });
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'An unknown error occured.' });
		}
	}
}