import User from '../model/User';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

export const getUserProfilePicture = async (req: Request, res: Response) => {
	if (!req?.params?.id) return res.status(400).json({ message: 'User ID required' });
	const user = await User.findOne({ _id: req.params.id }).exec();
	if (!user) {
		return res.status(204).json({ message: `User ID ${req.params.id} not found` });
	}
	
	const picturePath = path.join(__dirname, '../assets/profile_pictures/', `${user?.profilePicture}`);
	const stream = fs.createReadStream(picturePath);
	stream.on('error', () => {
		res.status(404).json({ message: 'Profile picture not found' });
	});
	stream.pipe(res);
}