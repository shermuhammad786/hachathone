import { sendMessage } from '../helpers/sendMessage.js';
import { QuestionModel } from '../models/questionModel.js';
import { QuizModel } from '../models/quizModel.js';

class questionService {

    createQuestionService = async (req) => {
        const {quizId} = req.params;
        const quiz = await QuizModel.findById(req.body.quizId); 
        const newQuestion = new QuestionModel(req.body);
        const savedQuestion = await newQuestion.save();
        await quiz.questions.push(savedQuestion._id)
        await quiz.save();

        if (savedQuestion) {
            return sendMessage(true, "Question saved successfully", savedQuestion)
        } else {
            return sendMessage(false, "Question not saved", savedQuestion)
        }
    }

    getQuestionService = async (req) => {

        const { limit = 10, pageNo = 1, search = "", orderby, sortByField, difficulty, type } = req.query;

        let conditions = [];
        conditions.push({ type: { $regex: search, $options: 'i' } });
        conditions.push({ points: { $regex: search, $options: 'i' } });
        conditions.push({ difficulty: { $regex: search, $options: 'i' } });
        conditions.push({ question: { $regex: search, $options: 'i' } });
        conditions.push({ correct_answer: { $regex: search, $options: 'i' } });

        let query = {};
        if (conditions.length > 0) {
            query.$or = conditions;
        }
        if (difficulty?.toLowerCase() === "hard" || difficulty?.toLowerCase() === "easy" || difficulty?.toLowerCase() === "medium") {
            query.difficulty = difficulty

        }
        if (type?.toLowerCase() === "multiple" || type?.toLowerCase() === "single") {
            query.type = type
        }

        const sort = {};
        sort[sortByField] = orderby === "asc" ? 1 : -1


        const getQuestions = await QuestionModel.find(query).limit(limit).skip(parseInt(limit) * (pageNo - 1)).sort(sort).lean()
        if (getQuestions) {
            return sendMessage(true, "Question getted successfully", getQuestions)
        } else {
            return sendMessage(false, "Question not getted", getQuestions)
        }
    }

    getQuizQuestionService = async (req) => {
        const { quizId } = req.params

        const { limit = 10, pageNo = 1, search = "", orderby, sortByField, difficulty, type } = req.query;

        let conditions = [];
        conditions.push({ type: { $regex: search, $options: 'i' } });
        conditions.push({ points: { $regex: search, $options: 'i' } });
        conditions.push({ difficulty: { $regex: search, $options: 'i' } });
        conditions.push({ question: { $regex: search, $options: 'i' } });
        conditions.push({ correct_answer: { $regex: search, $options: 'i' } });

        let query = {};
        if (conditions.length > 0) {
            query.$or = conditions;
        }

        if (difficulty?.toLowerCase() === "hard" || difficulty?.toLowerCase() === "easy" || difficulty?.toLowerCase() === "medium") {
            query.difficulty = difficulty
        } else if (difficulty === "") {
            return sendMessage(false, "Please put the difficulity (Easy, Medium, Hard)")
        }
        if (type?.toLowerCase() === "multiple" || type?.toLowerCase() === "single") {
            query.type = type
        } else if (type === "") {
            return sendMessage(false, "Please put the type (Multiple , Single)")
        }

        const sort = {};
        sort[sortByField] = orderby === "asc" ? 1 : -1

        const getQuestion = await QuestionModel.find({ quizId, ...query }).populate("quizId").limit(limit).skip(parseInt(limit) * (pageNo - 1)).sort(sort).lean();
        if (getQuestion) {
            return sendMessage(true, "Question getted by id successfully", getQuestion)
        } else {
            return sendMessage(false, "Question not getted by id", getQuestion)
        }
    }

    updateQuestionService = async (req) => {
        const { questionId } = req.params
        const updateQuestion = await QuestionModel.findByIdAndUpdate(questionId, req.body, { new: true, runValidators: true });
        if (updateQuestion) {
            return sendMessage(true, "Question updated successfully", updateQuestion)
        } else {
            return sendMessage(false, "Question not updated", updateQuestion)
        }

    }

    deleteQuestionService = async (req) => {
        const { questionId } = req.params
        const deleteQuestion = await QuestionModel.findByIdAndDelete(questionId);
        if (deleteQuestion) {
            return sendMessage(true, "Question deleted successfully", deleteQuestion)
        } else {
            return sendMessage(false, "Question not deleted", deleteQuestion)
        }
    }
}

export { questionService }