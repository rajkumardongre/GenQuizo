const mongoose = require('mongoose');

const StudentQuizSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    topics: {
        type: Map,
        of: {
            correct: [{
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Question'
                },
                userOption: {
                    type: Number // Assuming the userOption is a number
                }
            }],
            wrong: [{
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Question'
                },
                userOption: {
                    type: Number // Assuming the userOption is a number
                }
            }]
        }
    },
}, { timestamps: true });

const StudentQuiz = mongoose.model('Studentquiz', StudentQuizSchema);

module.exports = StudentQuiz;
