import {QuizReport} from '../models/quizReport.model.js';

class QuizReportService {

    getQuizReportsService = async () => {
        return QuizReport.find();
    };
    
    getQuizReportByIdService = async (id) => {
        return QuizReport.findById(id);
    };
    
    createQuizReportService = async (data) => {
        const quizReport = new QuizReport(data);
        return quizReport.save();
    };
    
    updateQuizReportService = async (id, data) => {
        return QuizReport.findByIdAndUpdate(id, data, { new: true });
    };

    deleteQuizReportService = async (id) => {
        return QuizReport.findByIdAndDelete(id);
    };
    
}
   
export {QuizReportService}