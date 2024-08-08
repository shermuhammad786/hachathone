import { sendMessage } from "../helpers/sendMessage.js";
import { logger } from "../index.js";
import { QuizService } from "../service/quizService.js";
const { createQuizService, updateQuizService,deleteQuizService,getQuizService } = new QuizService
export const createQuiz = async (req, res) => {
    try {
        const result = await createQuizService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(sendMessage(true, result.message, result.data));
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);

        }
    } catch (error) {
        logger.error("Internal server error", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error",error))
    }
}
export const updateQuiz = async (req, res) => {
    try {
        const result = await updateQuizService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(sendMessage(true, result.message, result.data));
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error",error))
    }
}

export const deleteQuiz = async (req, res) => {
    try {
        const result = await deleteQuizService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(sendMessage(true, result.message, result.data));
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error",error))
    }
}

export const getQuiz = async (req, res) => {
    try {
        const result = await getQuizService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(sendMessage(true, result.message, result.data));
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error", error))
    }
}