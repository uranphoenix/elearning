const express = require('express');
const router = express.Router();

const Class = require('../model/class');
const User = require('../model/user');
const Instructor = require('../model/instructor');
const Student = require("../model/student");

router.get('/classes', async (req, res, next) => {
    const instructor = (await Instructor.getByUsername(req.user.username));
    res.render('instructors/classes', {instructor: instructor});
});

router.post('/classes/register', async (req, res, next) => {
    const info = {
        instructor_username: req.user.username,
        class_id: req.body.class_id,
        class_title: req.body.class_title
    }

    const instructor = await Instructor.register(info);
    req.flash('success_msg', "You are now registered to teach this class");
    res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', async (req, res, next) => {
    res.render('instructors/newlesson', {class_id: req.params.id});
});

router.post('/classes/:id/lessons/new', async (req, res, next) => {
    const info = {
        class_id: req.params.id,
        lesson_number: req.body.lesson_number,
        lesson_title: req.body.lesson_title,
        lesson_body: req.body.lesson_body
    }

    const newClass = await Class.addLesson(info);
    console.log(newClass);
    req.flash('success_msg', 'Lesson added');
    res.redirect('/instructors/classes');
})

module.exports = router;
