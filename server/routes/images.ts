import express from 'express';
const router = express.Router();
import * as imagesController from '../controllers/imagesController';

router.route('/profiles/:id').get(imagesController.getUserProfilePicture);

module.exports = router;