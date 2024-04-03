const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// const workerController = require('./controllers/worker');
// const clientController = require('./controllers/client');
// const adminController = require('./controllers/admin');
// const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const teacherPublicRoutes = require("./routes/teacher/teacher")
const teacherPublicAPIRoutes = require("./routes/teacher/api")
const teacherProtectedAPIRoutes = require("./routes/teacher/protectedAPI")
const teacherProtectedUIRoutes = require("./routes/teacher/protectedUI")

const studentPublicRoutes = require("./routes/student/student")
const studentPublicAPIRoutes = require("./routes/student/api")
const studentProtectedAPIRoutes = require("./routes/student/protectedAPI")
const studentProtectedUIRoutes = require("./routes/student/protectedUI")


// const clientRoutes = require('./routes/client');
const { requireTeacherAuth, requireTeacherAuthUI, requireStudentAuth, requireStudentAuthUI } = require('./middleware/auth');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.set('strictQuery', true);
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_CONNECTION_URI ;
mongoose
	.connect(dbURI)
	.then((result) => app.listen(port, () => console.log(`Listening on port ${port}`)))
	.catch((err) => console.log(err));

app.get('/test', (req, res) => {
	// res.redirect('/api/client/home')
	res.send("Hello from GenQuizo")
});


// Public routes
app.use("/", publicRoutes)

// Public Teacher
app.use("/teacher", teacherPublicRoutes)
app.use("/api/teacher", teacherPublicAPIRoutes)

// Public Student
app.use("/student", studentPublicRoutes)
app.use("/api/student", studentPublicAPIRoutes)

// Protected routes
// Protected Teacher
app.use("/teacher", requireTeacherAuthUI, teacherProtectedUIRoutes)
app.use("/api/teacher", requireTeacherAuth, teacherProtectedAPIRoutes)

// Protected Student
app.use("/student", requireStudentAuthUI, studentProtectedUIRoutes)
app.use("/api/student", requireStudentAuth, studentProtectedAPIRoutes)


// // Public Route for Admin
// app.post('/api/admin/login', adminController.login_post);
// app.get('/api/admin/login', (req, res) => {
// 	res.render('admin/login', { errMsg: '' });
// });

// // Worker Public Routes
// app.post('/api/worker/register', upload.single('addharCard'), workerController.register_post);
// app.get('/api/worker/register', (req, res) => {
// 	res.render("worker/register", {errMsg : ""})
// });
// app.post('/api/worker/login', workerController.login_post);
// app.get('/api/worker/login', (req, res) => {
// 	res.render("worker/login", {errMsg : ""})
// });


// // Client Public Routes
// app.post('/api/client/register', clientController.register_post);
// app.get('/api/client/register', (req, res) => {
// 	res.render('client/register', { errMsg: '' });
// });
// app.post('/api/client/login', clientController.login_post);
// app.get('/api/client/login', (req, res) => {
// 	res.render('client/login', { errMsg: '' });
// });

// // Worker Protected Routes
// app.use("/api/worker/", requireWorkerAuth, workerRoutes)

// // Client Protected Routes
// app.use('/api/client/', requireClientAuth, clientRoutes);

// // Admin Protected Routes
// // app.use("/api/admin/", requireAdminAuth, adminRoutes)
// app.use('/api/admin/', requireAdminAuth, adminRoutes);
