const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
    attemptedQuiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentquiz'
    }],
	
}, {timestamps: true});

studentSchema.statics.login = async function (email, password) {
	const student = await this.findOne({ email });
	if (student) {
		// const auth = await bcrypt.compare(password, user.password);
		const auth = password == student.password;
		if (auth) {
			return student;
		}
		//   throw Error('incorrect password');
		return null;
	}
	// throw Error('incorrect email');
	return null;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
