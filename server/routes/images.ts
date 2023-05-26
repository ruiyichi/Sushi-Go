import express from 'express';
const router = express.Router();
import * as imagesController from '../controllers/imagesController';

router.route('/profiles/:id').get(imagesController.getUserProfilePicture);
router.route('/profilePictures').get(imagesController.getAllProfilePictureURLs);
router.route('/profilePictures/:filename').get(imagesController.getProfilePictureByFilename);
router.post('/profilePicture', imagesController.setProfilePicture);

module.exports = router;