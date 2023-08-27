const express = require('express');
const router = express.Router();

const Class = require('../model/class');
const User = require('../model/user');
const Student = require('../model/student');

router.get('/classes', async (req, res, next) => {
    const student = (await Student.getByUsername(req.user.username));
    res.render('students/classes', {student: student});
});

module.exports = router;
