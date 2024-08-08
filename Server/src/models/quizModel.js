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
    locationRestriction: {
        type: Boolean,
        require: true
    },
    tabSwitchingRestriction: {
        type: Boolean,
        require: true
    },
    customMode: {
        type: Boolean,
        require: true
    },
    timeLimits: {
        type: String,
        enum: ["easy", "medium", "difficult"],
        require: true
    },
},
    { timestamps: true }
)

export const QuizModel = mongoose.model("Quiz", QuizSchema)