//  mongoDB connection
import './config/database.mongodb.js'
import express from "express"
import { quizRouter } from './routes/quiz.router.js';
import authRoutes from './routes/authRoutes.js';
import { initializeLogger } from './helpers/logger.js';
import { environments } from './environments/environments.js';
import passport from './passport/passport.js'
import session from "express-session"

const PORT = environments.PORT

const app = express();

export const logger = initializeLogger()
app.use(express.json())

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