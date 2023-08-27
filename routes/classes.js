const express = require('express');
const router = express.Router();

const Class = require('../model/class');

//Classes page
router.get('/', function(req, res, next) {
    Class.getClasses(3).then((classes) => {
        res.render('classes/index', { classes: classes });
    });
});

//Class details
router.get('/:id/details', function(req, res, next) {
    Class.getClassById(req.params.id).then((cl) => {
        res.render('classes/details', { cl: cl });
    });
});

router.get('/:id/lessons', function(req, res, next) {
    Class.getClassById(req.params.id).then((cl) => {
        res.render('classes/lessons', { cl: cl });
    });
});

router.get('/:id/lessons/:lesson_id', async function(req, res, next) {
    let lesson;
    const cl = await Class.getClassById(req.params.id);
    console.log(cl);
    for (let i = 0; i < cl.lessons.length; i++) {
        console.log(2);
        if (cl.lessons[i].lesson_number === +req.params.lesson_id) {
            console.log(1);
            lesson = cl.lessons[i];
        }
    }
    res.render('classes/lesson', {cl: cl, lesson: lesson});
});

module.exports = router;