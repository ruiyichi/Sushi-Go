import express from 'express';
import { handlePing } from '../controllers/pingController';

const router = express.Router();
router.get('/', handlePing);

module.exports = router;