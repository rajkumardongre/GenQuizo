const Student = require("../models/Student.js");
const Quiz = require("../models/Quiz.js");
const StudentQuiz = require("../models/StudentQuiz.js");

const jwt = require("jsonwebtoken");

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createStudentToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

const register_post = async (req, res, next) => {
  try {
    await Student.init(); // Initialize the Student model

    // Create a new student instance
    const new_student = new Student({
      email: req.body.email,
      password: req.body.password,
    });

    // Save the new student document to the database
    const result = await new_student.save();

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.login(email, password);
    if (student == null) {
      // res.render('admin/login', { errMsg: 'Invalid Crediential' });
      return res
        .status(403)
        .json({ success: false, error: "Student Access Denied" });
    } else {
      const token = createStudentToken(student._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      // res.redirect('/api/admin/dashboard');
      return res
        .status(200)
        .json({ success: true, data: "Student login successfully!" });
    }
  } catch (err) {
    console.log(err.message);
    // res.render('admin/login', { errMsg: err.message });
    return res.status(403).json({ success: false, error: err.message });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  // res.redirect('/api/admin/login');
  return res
    .status(200)
    .json({ success: true, data: "Student logout successfully!" });
};

const renderDashboard = async (req, res) => {
  return res.render("student/dashboard");
};

const getMyDashboard = async (req, res) => {
  const studentId = req.studentId;

  try {
    // Fetch all quizzes
    const quizzes = await Quiz.find();

    // Modify quizzes to add attempted boolean field
    const quizzesWithAttemptedFlag = quizzes.map((quiz) => {
      // Check if student has attempted the quiz
      const attempted = quiz.attempts.some((id) => id.toString() === studentId);
      // Add attempted boolean field to the quiz object
      return { ...quiz.toObject(), attempted };
    });

    const user = await Student.findById(studentId);

    // Send the modified quizzes as response
    res
      .status(200)
      .json({ success: true, quizzes: quizzesWithAttemptedFlag, user: user });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const attemptQuiz = async (req, res) => {
  const quizId = req.query.id; // Get quiz ID from query parameter
  const studentId = req.studentId;

  const studentHasAttemptedQuiz = await StudentQuiz.exists({ quizId, studentId });
  if (studentHasAttemptedQuiz) {
      // Return an error response indicating that the student has already attempted the quiz
      return res.status(400).json({ success: false, error: 'Student has already attempted this quiz' });
  }

  try {
    // Fetch the quiz with the provided ID and populate the questions field
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, quiz: quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getQuizData = async (req, res) => {
    const quizId = req.params.quizId;
    const studentId = req.studentId;

    try {
        // Find the StudentQuiz entry based on quizId and studentId, and populate all fields
        const studentQuiz = await StudentQuiz.findOne({ quizId, studentId })
            .populate({
                path: 'quizId',
                populate: { path: 'questions' }
            })
            // .populate({
            //     path: 'topics.correct.questionId',
            //     model: 'Question'
            // })
            // .populate({
            //     path: 'topics.wrong.questionId',
            //     model: 'Question'
            // })
            // .exec();

        if (!studentQuiz) {
            return res.status(404).json({ success: false, error: 'Student quiz data not found' });
        }

        res.status(200).json({ success: true, data: studentQuiz });
    } catch (error) {
        console.error('Error getting student quiz data:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


const submitQuiz = async (req, res) => {
  try {
    const { responses } = req.body;
    const quizId = req.query.id;
    const studentId = req.studentId;

    const studentHasAttemptedQuiz = await StudentQuiz.exists({ quizId, studentId });
    if (studentHasAttemptedQuiz) {
        // Return an error response indicating that the student has already attempted the quiz
        return res.status(400).json({ success: false, error: 'Student has already attempted this quiz' });
    }

    // Fetch the quiz by ID to get its questions
    const quiz = await Quiz.findById(quizId).populate("questions");

    // Map question IDs to their respective options
    const responseMap = new Map(responses);
    // Prepare data for the StudentQuiz entry
    // const topics = {topic1 : { correct: [], wrong: [] }, topic2 : { correct: [], wrong: [] }};
    // Initialize the topics object
    const topics = {};

    // Iterate over each question in the quiz
    for (const question of quiz.questions) {
      const userOption = responseMap.get(question._id.toString()); // Get the user's selected option

      // If the userOption is not undefined (i.e., the question was attempted)
      if (userOption !== undefined) {
        const topic = question.topic;

        // Ensure the topic exists in the topics object
        if (!topics[topic]) {
          topics[topic] = { correct: [], wrong: [] };
        }

        // Determine whether the user's option matches the correct answer
        const isCorrect = userOption === question.answer;

        // Add the question to the appropriate array based on correctness
        if (isCorrect) {
          topics[topic].correct.push({ questionId: question._id, userOption });
        } else {
          topics[topic].wrong.push({ questionId: question._id, userOption });
        }
      }
    }
    console.log({
      quizId,
      studentId,
      topics,
    });
    // Create a new StudentQuiz entry
    const studentQuiz = new StudentQuiz({
      quizId,
      studentId,
      topics,
    });

    // Save the StudentQuiz entry
    await studentQuiz.save();

    // Push the studentQuiz ID to the Student model
    await Student.findByIdAndUpdate(studentId, {
      $push: { attemptedQuiz: studentQuiz._id },
    });

    // Push the studentId to the attempts field in the Quiz model
    await Quiz.findByIdAndUpdate(quizId, { $push: { attempts: studentId } });

    res
      .status(200)
      .json({
        success: true,
        message: "Quiz submitted successfully",
        data: studentQuiz,
      });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  register_post,
  login_post,
  logout,
  renderDashboard,
  getMyDashboard,
  attemptQuiz,
  submitQuiz,
  getQuizData,
};
