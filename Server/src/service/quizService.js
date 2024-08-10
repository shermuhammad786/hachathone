import { sendMessage } from "../helpers/sendMessage.js";
import { QuizModel } from "../models/quizModel.js";

class QuizService {
    createQuizService = async (req) => {
        const { title, description, course, deadline, duration, locationRestriction, tabSwitchingRestriction, customMode, time_limits } = req.body

        const newQuiz = new QuizModel(req.body)

        if (newQuiz) {
            const savedQuiz = await newQuiz.save();
            if (savedQuiz) {
                return (sendMessage(true, "Quiz created successfully", savedQuiz))
            } else {
                return sendMessage(false, "Quiz not saved")
            }
        }
    }
    updateQuizService = async (req) => {
        const { quizId } = req.params
        const { title, description, course, deadline, duration, locationRestriction, tabSwitchingRestriction, customMode, time_limits } = req.body

        const quiz = await QuizModel.findByIdAndUpdate(quizId, req.body, { new: true })
        if (quiz) {
            return (sendMessage(true, "Quiz updated successfully", quiz))
        } else {
            return sendMessage(false, "Quiz not updated")
        }
    }
    deleteQuizService = async (req) => {
        const { quizId } = req.params

        const quiz = await QuizModel.findByIdAndDelete(quizId)

        if (quiz) {
            return (sendMessage(true, "Quiz deleted successfully", quiz))
        } else {
            return sendMessage(false, "Quiz not deleted")
        }
    }
    getQuizService = async (req) => {

        const { limit = 10, pageNo = 1, search = "", orderby, sortByField, locationRestriction, tabSwitchingRestriction, customMode } = req.query;
        

        let conditions = [];
        conditions.push({ title: { $regex: search, $options: 'i' } });
        conditions.push({ course: { $regex: search, $options: 'i' } });
        conditions.push({ duration: { $regex: search, $options: 'i' } });

        let query = {};
        if (conditions.length > 0) {
            query.$or = conditions;
        }


        if (locationRestriction === "false" || locationRestriction === "true") {
            
            query.locationRestriction = locationRestriction
        }
        if (tabSwitchingRestriction === "false" || tabSwitchingRestriction === "true") {
            query.tabSwitchingRestriction = tabSwitchingRestriction
        }
        if (customMode === "false" || customMode === "true") {
            query.customMode = customMode
        }
        const sort = {};
        sort[sortByField] = orderby === "asc" ? 1 : -1



        const quiz = await QuizModel.find(query).populate("questions").limit(limit).skip(parseInt(limit) * (pageNo - 1)).sort(sort).lean()

        if (quiz) {
            return (sendMessage(true, "Quiz getted successfully", quiz))
        } else {
            return sendMessage(false, "Quiz not getted")
        }
    }
}

export { QuizService }