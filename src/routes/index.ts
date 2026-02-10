import { Router } from 'express';
import authRouter from './auth.js';
import teachersRouter from '../routes/teachers.js';
const router = Router();

router.use('/auth', authRouter);
router.use('/teachers', teachersRouter);

export default router;
