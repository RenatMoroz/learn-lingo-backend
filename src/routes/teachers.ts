import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as controlers from '../controllers/teachersController.js';

const router = Router();
router.get('/', ctrlWrapper(controlers.getAllTeachers));
router.get('/:teacherId', ctrlWrapper(controlers.getTeacherById));
router.post('/', ctrlWrapper(controlers.createTeacher));
router.patch('/:teacherId', ctrlWrapper(controlers.updateTeacherById));
router.delete('/:teacherId', ctrlWrapper(controlers.deleteTeacherById));
export default router;
