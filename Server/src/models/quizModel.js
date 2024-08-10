import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    course: {
        type: String,
        require: true
    },
    deadline: {
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true
    },
    location_restriction: {
        type: Boolean,
        require: true
    },
    tab_switching_restriction: {
        type: Boolean,
        require: true
    },
    custom_mode: {
        type: Boolean,
        require: true
    },
    time_limits: {
        type: String,
        enum: ["easy", "medium", "difficult"],
        require: true
    },
    questions: {
        type:[String],
        ref:"Questions"
    }
},
    { timestamps: true }
)

export const QuizModel = mongoose.model("Quiz", QuizSchema)