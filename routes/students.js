const express = require('express');
const router = express.Router();

const Class = require('../model/class');
const User = require('../model/user');
const Student = require('../model/student');
const Instructor = require("../model/instructor");

router.get('/classes', async (req, res, next) => {
    const student = (await Student.getByUsername(req.user.username));
    res.render('students/classes', {student: student});
});

router.post('/classes/register', async (req, res, next) => {
    const info = {
        student_username: req.user.username,
        class_id: req.body.class_id,
        class_title: req.body.class_title
    }

    const student = await Student.register(info);
    req.flash('success_msg', "You are now registered to learn this class");
    res.redirect('/students/classes');
});

module.exports = router;
