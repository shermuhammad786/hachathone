import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js"
import { roleTableSchema } from "../joi/roleTable.js";
import { allRole, createRole, deleteRole, updateRole } from "../controllers/roleTable.js";
import { jwtAuth } from "../middlewares/jwt.middleware.js";
import { authorizeRole } from "../middlewares/identification.js";


const roleTableRoutes = express.Router();
const tenantRoleTable = express.Router()

roleTableRoutes.post("/role", validateRequest(roleTableSchema), jwtAuth, authorizeRole("superAdmin"), createRole)
roleTableRoutes.put("/role/:id", jwtAuth, authorizeRole("superAdmin"), updateRole)
roleTableRoutes.delete("/role/:id", jwtAuth, authorizeRole("superAdmin"), deleteRole)
roleTableRoutes.get("/role", jwtAuth, authorizeRole("superAdmin"), allRole)

export default roleTableRoutes;