import { logger } from '../index.js';
import { studentService } from '../service/student.service.js';

const { createStudentService, getStudentService, getStudentsService, updateStudentService, deleteStudentService } = new studentService();

export async function createStudent(req, res) {
    try {
        const result = await createStudentService(req);
        const user = req.user;
        if (result?.status) {
            logger.info(`${result.message} ${user.email}`);
            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error create", { body: error });
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function getStudent(req, res) {
    try {
        const result = await getStudentService(req);
        const user = req.user;
        if (result?.status) {
            logger.info(`${result.message} ${user.email}`);
            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error get", { body: error });
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function getStudents(req, res) {
    try {
        const result = await getStudentsService(req);
        const user = req.user;
        if (result?.status) {
            logger.info(`${result.message} ${user.email}`);
            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error get", { body: error });
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function updateStudent(req, res) {
    try {
        const result = await updateStudentService(req);
        const user = req.user;
        if (result?.status) {
            logger.info(`${result.message} ${user.email}`);
            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error update", { body: error });
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function deleteStudent(req, res) {
    try {
        const result = await deleteStudentService(req);
        const user = req.user;
        if (result?.status) {
            logger.info(`${result.message} ${user.email}`);
            res.status(200).json(result);
        } else {
            logger.error(`${result?.message} ${user.email}`);
            return res.status(403).json(result);
        }
    } catch (error) {
        logger.error("Internal server error delete", { body: error });
        res.status(500).json({ message: "Internal server error", error });
    }
}
