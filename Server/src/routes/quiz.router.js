import e from "express";
import { createQuiz } from "../controllers/quiz.controller.js";
const quizRouter = e.Router();



quizRouter.post("/", createQuiz);



export { quizRouter }