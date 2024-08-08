import { any } from "joi";
import { roleTableModel } from "../models/role.model";
import { TenantModel } from "../models/tenant.model";


class Tenant {
    TenantById = async (id: any) => {
        const foundUser = await TenantModel.findById(id);
        return foundUser
    }
    Tenants = async () => {
        const foundUser = await TenantModel.find();
        return foundUser
    }
    TenantByName = async (tenantName: any) => {
        const foundUser = await TenantModel.findOne({ tenantName });
        return foundUser
    }
    TenantByEmail = async (email: any) => {
        const foundUser = await TenantModel.findOne({ email });
        return foundUser
    }

    TenantByIdAndDelete = async (tenantId: any) => {
        const foundUser = await TenantModel.findByIdAndDelete(tenantId);
        return foundUser
    }

}
export default Tenant

