import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema({
    quizId: { type: String, required: true, ref: "Quiz" },
    type: { type: String,enum: ["multiple", "single"], required: true },
    points: { type: String,required: true },
    difficulty: { type: String, enum: ["hard", "medium", "easy"], required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correct_answer: { type: String, required: true },
},
    { timestamps: true }
);

export const QuestionModel = model('Questions', QuestionSchema);
