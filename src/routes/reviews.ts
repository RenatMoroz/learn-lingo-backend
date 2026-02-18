import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as controllers from '../controllers/reviewsController.js';

const router = Router();

router.get('/', ctrlWrapper(controllers.getAllReviews));
router.get('/teacher/:teacherId', ctrlWrapper(controllers.getReviewsByTeacherId));
router.get('/:reviewId', ctrlWrapper(controllers.getReviewById));
router.post(
  '/teacher/:teacherId',
  ctrlWrapper(controllers.createReviewsForTeacher),
);
router.patch('/:reviewId', ctrlWrapper(controllers.updateReviewById));
router.delete('/:reviewId', ctrlWrapper(controllers.deleteReviewById));

export default router;
