import { Router } from 'express';
import { createStudent, getStudent, getStudents, updateStudent, deleteStudent } from '../controllers/student.controller.js';
import { jwtAuth } from '../middlewares/jwt.middleware.js';
import { authorizeRole } from '../middlewares/identification.js';

const studentRouter = Router();

studentRouter.post('/', jwtAuth, authorizeRole("superAdmin"), createStudent);
studentRouter.get('/', jwtAuth, authorizeRole("superAdmin"), getStudents);
studentRouter.get('/:studentId', jwtAuth, authorizeRole("superAdmin"), getStudent);
studentRouter.put('/:studentId', jwtAuth, authorizeRole("superAdmin"), updateStudent);
studentRouter.delete('/:studentId', jwtAuth, authorizeRole("superAdmin"), deleteStudent);

export default studentRouter;
