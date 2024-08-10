import { Router } from 'express';
import { createQuestion, getQuestion, getQuizQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller.js';
import { jwtAuth } from '../middlewares/jwt.middleware.js';
import { authorizeRole } from '../middlewares/identification.js';

const questionRouter = Router();
const studenQuestionRouter = Router();

questionRouter.post('/', jwtAuth, authorizeRole("superAdmin"), createQuestion);
questionRouter.get('/', jwtAuth, authorizeRole("superAdmin"), getQuestion);
questionRouter.get('/quiz/:quizId', jwtAuth, authorizeRole("superAdmin"), getQuizQuestion);
questionRouter.put('/:questionId', jwtAuth, authorizeRole("superAdmin"), updateQuestion);
questionRouter.delete('/:questionId', jwtAuth, authorizeRole("superAdmin"), deleteQuestion);

studenQuestionRouter.get('/', jwtAuth, authorizeRole("student"), getQuestion);

export { studenQuestionRouter }
export default questionRouter;
