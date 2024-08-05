import { sendMessage } from "../helper/sendMessage";
import { QuizModel } from "../models/quiz.model";

export const createQuiz = async (req, res) => {
    try {
        const { title, description, course, deadline, duration, location_restriction, tab_switching_restriction, custom_mode, time_limits } = req.body
        const newQuiz = new QuizModel(req.body)
        if (newQuiz) {
            const savedQuiz = await newQuiz.save();
            res.json(sendMessage(true, "quiz saved successfully", savedQuiz))
        }

    } catch (error) {
        console.log(error, " craete quiz error");
    }
}