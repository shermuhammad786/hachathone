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
        type: String,
        require: true
    },
    tab_switching_restriction: {
        type: String,
        require: true
    },
    custom_mode: {
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true
    },
})