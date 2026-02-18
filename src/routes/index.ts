import { Router } from 'express';
import authRouter from './auth.js';
import teachersRouter from '../routes/teachers.js';
import reviewsRouter from '../routes/reviews.js';
const router = Router();

router.use('/auth', authRouter);
router.use('/teachers', teachersRouter);
router.use('/reviews', reviewsRouter);

export default router;
