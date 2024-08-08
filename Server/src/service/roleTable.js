import { sendMessage } from "../helpers/sendMessage.js";
import { roleTableModel } from "../models/role.model.js";
import RoleTable from "../repositories/role.js";
const { RoleById, RoleByIdAndUpdate, RoleByIdAndDelete } = new RoleTable
class RoleService {
    createNewRole = async (req) => {
        const { name, description, permission } = req.body;
        const newRole = new roleTableModel({ roleName: name, description, permission });
        await newRole.save();
        return sendMessage(true, "New role has been created", { name, description, permission })
    }
    updateExistsRole = async (req) => {
        const { roleName, description, permission } = req.body;
        const { id } = req.params
        const udpate = await RoleByIdAndUpdate(id, req.body)
        if (udpate) {
            return sendMessage(true, "Role has been updated", { roleName, description, permission });
        } else {
            return sendMessage(true, "Role doesn't updated", { roleName, description, permission });
        }

    }

    deleteExistsRole = async (req) => {
        const { id } = req.params
        const UserRole = await RoleById(id)

        const delet = await RoleByIdAndDelete(id)
        if (delet) {
            return sendMessage(true, "Role has been deleted", UserRole);
        } else {
            return sendMessage(true, "Role doesn't deleted", UserRole);
        }
    }

    allRoles = async (req) => {
        const user = req.user
        const isAdmin = await RoleById(user.roleId);

        const { limit = 10, pageNo = 1, search = "", orderby, sortByField } = req.query;

        const conditions = [];

        conditions.push({ roleName: { $regex: search, $options: 'i' } });

        let query = {}
        if (conditions.length > 0) {
            query.$or = conditions
        } else {
            query = conditions
        }

        const sort = {};
        sort[sortByField] = orderby === "asc" ? 1 : -1

        if (isAdmin?.roleName === "superAdmin") {
            const RoleForAdmin = await roleTableModel.find(query).limit(limit).skip(limit * (pageNo - 1)).sort(sort).lean();

            if (RoleForAdmin && RoleForAdmin.length !== 0) {
                return sendMessage(true, "all roles", RoleForAdmin)
            } else {
                return sendMessage(false, "No data available")
            }
        }
        if (isAdmin?.roleName === "tenant") {
            const RoleForTenant = await roleTableModel.find({ roleName: { $in: ["user", "tenant"] }, ...query }).limit(limit).skip(limit * (pageNo - 1)).sort(sort).lean();

            if (RoleForTenant && RoleForTenant.length !== 0) {

                if (RoleForTenant?.roleName === "superAdmin") {
                    return sendMessage(false, `Please first create a User role`)
                } else {
                    return sendMessage(true, "all roles", RoleForTenant)
                }
            } else {
                return sendMessage(false, 'No data available', user);
            }
        }
    }
}

export default RoleService;