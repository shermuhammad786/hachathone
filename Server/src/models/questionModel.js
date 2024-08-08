import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema({
    quizId: { type: String, required: true, unique: true, ref: "Quiz" },
    category: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    incorrect_answers: { type: [String], required: true },
},
    { timestamps: true }
);

export const QuestionModel = model('Questions', QuestionSchema);
