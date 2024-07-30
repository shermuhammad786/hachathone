import e from "express";
import { createQuiz } from "../controller/quiz.controller.js";
const quizRouter = e.Router();



quizRouter.post("/", createQuiz);



export { quizRouter }