import User from '../model/User';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

export const getUserProfilePicture = async (req: Request, res: Response) => {
	const id = req?.params?.id
	if (!id) return res.status(400).json({ message: 'User ID required' });
	try {
		const user = await User.findOne({ _id: id }).exec();
		if (!user) {
			return res.status(204).json({ message: `User ID ${id} not found` });
		}

		const picturePath = path.join(__dirname, '../assets/profile_pictures/', `${user?.profilePicture}`);
		const stream = fs.createReadStream(picturePath);
		stream.on('error', () => {
			res.status(404).json({ message: 'Profile picture not found' });
		});
		stream.pipe(res);
	}
	catch (e) {
		if (e instanceof Error.CastError) {
			return res.status(400).json({ message: `Invalid user id ${id}` });
		}
		return res.status(404).json({ message: 'Profile picture not found' });
	}
}

export const getAllProfilePictureURLs = async (req: Request, res: Response) => {
	const pictures_dir = path.join(__dirname, '../assets/profile_pictures/');
	fs.readdir(pictures_dir, (err, filenames) => {
		if (err) {
			return res.status(400).json({ message: 'An error occured while reading profile pictures' });
		}
		res.json({ urls: filenames })
	});
}

export const getProfilePictureByFilename = async (req: Request, res: Response) => {
	const filename = req?.params?.filename;
	if (!filename) return res.status(400).json({ message: 'Filename required' });
	const picturePath = path.join(__dirname, '../assets/profile_pictures/', filename);
	const stream = fs.createReadStream(picturePath);
	stream.on('error', () => {
		res.status(404).json({ message: 'Profile picture not found' });
	});
	stream.pipe(res);
}

export const setProfilePicture = async (req: Request, res: Response) => {
	const { filename } = req.body;
	if (!filename) return res.status(400).json({ message: 'Filename is required.' });

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (foundUser) {
		await User.findByIdAndUpdate(foundUser?._id, { profilePicture: filename });
		res.sendStatus(200);
	}
}