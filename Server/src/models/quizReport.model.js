import mongoose from'mongoose'  ;

const QuizReportSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  studentId: { type: String, required: true },
  score: { type: Number, required: true },
  dateTaken: { type: Date, required: true },
  timeTaken: { type: String, required: true },
  flagged_questions: { type: [String], required: true },
});

export const QuizReport = mongoose.model('QuizReport', QuizReportSchema);
