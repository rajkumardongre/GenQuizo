const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');


const requireStudentAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const student = await Student.findById(decodedToken.id);
            if (!student) {
                return res.status(403).json({ success: false, error: 'Student Access Denied' });
            }
            req.studentId = decodedToken.id;
            next();
        } catch (err) {
            console.error(err);
            return res.status(403).json({ success: false, error: 'Student Access Denied' });
        }
    } else {
        return res.status(403).json({ success: false, error: 'Student Access Denied' });
    }
};


const requireTeacherAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const teacher = await Teacher.findById(decodedToken.id);
            if (!teacher) {
                return res.status(403).json({ success: false, error: 'Teacher Access Denied' });
            }
            req.teacherId = decodedToken.id;
            next();
        } catch (err) {
            console.error(err);
            return res.status(403).json({ success: false, error: 'Teacher Access Denied' });
        }
    } else {
        return res.status(403).json({ success: false, error: 'Teacher Access Denied' });
    }
};


const requireTeacherAuthUI = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const teacher = await Teacher.findById(decodedToken.id);
            if (!teacher) {
                return res.redirect("/teacher/login");
            }
            req.teacherId = decodedToken.id;
            next();
        } catch (err) {
            console.error(err);
            return res.redirect("/teacher/login");
        }
    } else {
        return res.redirect("/teacher/login");
    }
};

const requireStudentAuthUI = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const student = await Student.findById(decodedToken.id);
            if (!student) {
                return res.redirect("/student/login");
            }
            req.studentId = decodedToken.id;
            next();
        } catch (err) {
            console.error(err);
            return res.redirect("/student/login");
        }
    } else {
        return res.redirect("/student/login");
    }
};

module.exports = {
	requireStudentAuth,
	requireTeacherAuth,
    requireTeacherAuthUI,
    requireStudentAuthUI,
};
