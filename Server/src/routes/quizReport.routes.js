import { Router } from 'express';
import QuizReportController from '../controllers/quizReport.controller.js';

const quizReportRoutes = Router();

quizReportRoutes.get('/quizReports', QuizReportController.getQuizReports);
quizReportRoutes.get('/quizReports/:id', QuizReportController.getQuizReportById);
quizReportRoutes.post('/quizReports', QuizReportController.createQuizReport);
quizReportRoutes.put('/quizReports/:id', QuizReportController.updateQuizReport);
quizReportRoutes.delete('/quizReports/:id', QuizReportController.deleteQuizReport);

export default quizReportRoutes;
