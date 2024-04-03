const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    topic: {type: String, required:true},
    generated_resources : { type: String },
    options: { 
        type: [String],
        required: true,
        validate: {
            validator: function(arr) {
                // Check if array has exactly 4 unique elements
                return Array.isArray(arr) && arr.length === 4 && new Set(arr).size === 4;
            },
            message: props => `${props.value} must be an array of 4 unique strings`
        }
    },
    answer: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(val) {
                // Check if answer is one of 1, 2, 3, or 4
                return [1, 2, 3, 4].includes(val);
            },
            message: props => `${props.value} must be 1, 2, 3, or 4`
        }
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
