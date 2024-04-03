const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
    quizId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    }],
}, {timestamps: true});

teacherSchema.statics.login = async function (email, password) {
	const teacher = await this.findOne({ email });
	if (teacher) {
		// const auth = await bcrypt.compare(password, user.password);
		const auth = password == teacher.password;
		if (auth) {
			return teacher;
		}
		//   throw Error('incorrect password');
		return null;
	}
	// throw Error('incorrect email');
	return null;
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
