import { Request, Response } from "express";

export const handlePing = (req: Request, res: Response) => {
  res.json({ status: 'Success' });
}