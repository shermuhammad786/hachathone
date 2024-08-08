import { logger } from '../index.js';
import { questionService } from '../service/question.service.js';
const { createQuestionService, getQuestionService, getQuizQuestionService, updateQuestionService, deleteQuestionService } = new questionService

export async function createQuestion(req, res) {
    try {
        const result = await createQuestionService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);

        }
    } catch (error) {
        logger.error("Internal server error create", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error", error))
    }
}

export async function getQuestion(req, res) {
    try {
        const result = await getQuestionService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);

        }
    } catch (error) {
        logger.error("Internal server error get", { body: error });
        res.status(500).json({ message: "internal server error", error: error })
    }
}

export async function getQuizQuestion(req, res) {
    try {
        const result = await getQuizQuestionService(req);

        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);

        }
    } catch (error) {
        logger.error("Internal server error quizId", { body: error });
        res.status(500).json("Internal server error")
    }
}

export async function updateQuestion(req, res) {
    try {
        const result = await updateQuestionService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);

        }
    } catch (error) {
        logger.error("Internal server error update", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error", error))
    }
}

export async function deleteQuestion(req, res) {
    try {
        const result = await deleteQuestionService(req);
        const user = req.user
        if (result?.status) {

            logger.info(`${result.message} ${user.email}`);

            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);

        }
    } catch (error) {
        logger.error("Internal server error delete", { body: error });
        res.status(500).json(sendMessage(false, "Internal server error", error))
    }
}
