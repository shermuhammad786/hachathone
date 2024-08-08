import e from "express";
import { createQuiz, deleteQuiz, getQuiz, updateQuiz } from "../controllers/quiz.controller.js";
import { jwtAuth } from "../middlewares/jwt.middleware.js";
import { authorizeRole } from "../middlewares/identification.js";
const quizRouter = e.Router();



quizRouter.post("/", jwtAuth, authorizeRole("superAdmin"), createQuiz);
quizRouter.put("/:quizId", jwtAuth, authorizeRole("superAdmin"), updateQuiz);
quizRouter.delete("/:quizId", jwtAuth, authorizeRole("superAdmin"), deleteQuiz);
quizRouter.get("/", jwtAuth, authorizeRole("superAdmin"), getQuiz);


export { quizRouter }   