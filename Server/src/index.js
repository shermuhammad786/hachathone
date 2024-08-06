import './config/database.mongodb.js'
import express from "express"
import { quizRouter } from './routes/quiz.router.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 8090



app.use("/api/auth", authRoutes);
app.use("quiz", quizRouter)

app.listen(PORT, () => {
    console.log("server is running on PORT " + PORT)
})