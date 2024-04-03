const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    title: {
        type: String,
        default: "Untitled"
    },
    attempts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    generated_topics_resources : {
        type: Map,
        of: String
    }
}, {timestamps: true});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
