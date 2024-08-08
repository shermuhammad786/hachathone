import RoleService from "../service/roleTable.js";
import { logger } from "../index.js";

const { createNewRole, updateExistsRole, deleteExistsRole, allRoles } = new RoleService


export const createRole = async (req, res) => {
    const { name, description, permission } = req.body;
    try {
        const result = await createNewRole(req);
        if (result?.status) {
            logger.info(`${result.message} ${result?.data?.email}`)
            return res.status(201).json({ message: result.message, data: result.data });
        } else {
            logger.error(`${result?.message} ${result?.data?.email}`)
            return res.status(400).json({ message: result?.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error });
    }
};
export const updateRole = async (req, res) => {
    const { name, description, permission } = req.body;
    try {
        const result = await updateExistsRole(req);
        if (result?.status) {
            logger.info(`${result.message} ${result?.data?.email}`)
            return res.status(201).json({ message: result.message, data: result.data });
        } else {
            logger.error(`${result?.message} ${result?.data?.email}`)
            return res.status(400).json({ message: result?.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error });
    }
};
export const deleteRole = async (req, res) => {
    const { name, description, permission } = req.body;
    try {
        const result = await deleteExistsRole(req);
        if (result?.status) {
            logger.info(`${result.message} ${result?.data?.email}`)
            return res.status(201).json({ message: result.message, data: result.data });
        } else {
            logger.error(`${result?.message} ${result?.data?.email}`)
            return res.status(400).json({ message: result?.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error });
    }
};
export const allRole = async (req, res) => {
    const { name, description, permission } = req.body;
    try {
        const result = await allRoles(req);
        if (result?.status) {
            logger.info(`${result.message} ${result?.data?.email}`)
            return res.status(200).json({ message: result.message, data: result.data });
        } else {
            logger.error(`${result?.message} ${result?.data?.email}`)
            return res.status(400).json({ message: result?.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error });
    }
};