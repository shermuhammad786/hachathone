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
import studentDocuments from "./student.json" assert  { type: "json" };;
import guest from "./guest.json" assert  { type: "json" };
import roleTableRoutes from './routes/roleRoutes.js';
import questionRouter, { studenQuestionRouter } from './routes/question.routes.js';
import studentRouter from './routes/student.routes.js';

const PORT = environments.PORT

const app = express();

export const logger = initializeLogger()

app.use(express.json())

app.use(cors())

app.use('/admin', swaggerUi.serveFiles(superAdminDocuments), swaggerUi.setup(superAdminDocuments))
app.use('/student', swaggerUi.serveFiles(studentDocuments), swaggerUi.setup(studentDocuments))
app.use('/guest', swaggerUi.serveFiles(guest), swaggerUi.setup(guest))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(passport.session())
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/admin", roleTableRoutes);
app.use("/api/quiz", quizRouter);
app.use("/api/question", questionRouter);

app.use("/api/student", studenQuestionRouter);

app.use("/api/student", studentRouter)

app.listen(PORT, () => {
    console.log("server is running on PORT " + PORT)
})