//  mongoDB connection
import './config/database.mongodb.js'
import express from "express"
import { quizRouter } from './routes/quiz.router.js';
import authRoutes from './routes/authRoutes.js';
import { initializeLogger } from './helpers/logger.js';
import { environments } from './environments/environments.js';
import passport from './passport/passport.js'
import session from "express-session"
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import superAdminDocuments from "./super-admin.json" assert  { type: "json" };
import tenantAdminDocuments from "./tenant-admin.json" assert  { type: "json" };;
import user from "./user.json" assert  { type: "json" };

const PORT = environments.PORT

const app = express();

export const logger = initializeLogger()
app.use(express.json())

app.use(cors({
    origin: "*"
}))
app.use('/admin', swaggerUi.serveFiles(superAdminDocuments), swaggerUi.setup(superAdminDocuments))
app.use('/tenant', swaggerUi.serveFiles(tenantAdminDocuments), swaggerUi.setup(tenantAdminDocuments))
app.use('/user', swaggerUi.serveFiles(user), swaggerUi.setup(user))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(passport.session())
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRouter)

app.listen(PORT, () => {
    console.log("server is running on PORT " + PORT)
})