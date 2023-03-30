import User from '../model/User';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: 'No users found' });
  res.json(users);
}

export const deleteUser = async (req: Request, res: Response) => {
  if (!req?.body?.id) return res.status(400).json({ message: 'User ID required' });
  const username = await User.findOne({ _id: req.body.id }).exec();
  if (!username) {
    return res.status(204).json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await username.deleteOne({ _id: req.body.id });
  res.json(result);
}

export const getUser = async (req: Request, res: Response) => {
  if (!req?.params?.id) return res.status(400).json({ message: 'User ID required' });
  const username = await User.findOne({ _id: req.params.id }).exec();
  if (!username) {
    return res.status(204).json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(username);
}