import { roleTableModel } from "../models/role.model.js"

export const authorizeRole = (role) => {
    return async (req, res, next) => {
        const user = req.user

        const findRole = await roleTableModel.findById(user.roleId)
        if (findRole) {
            if (!role.includes(findRole.roleName)) {
                return next(new Error(`Role: ${findRole.roleName} is not allowed to access this resource`))
            }
        }
        next();
    }
}
export const findRole = (role) => {
    return async (req, res, next) => {
        const { roleId } = req.body

        const findRole = await roleTableModel.findById(roleId)
        if (findRole) {
            if (!role.includes(findRole.roleName)) {
                return next(new Error(`Role Id: ${findRole.roleName} is not allowed to access this resource`))
            }
        }
        next();
    }
}