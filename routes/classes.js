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
        console.log(cl);
        res.render('classes/details', { cl: cl });
    });
});

module.exports = router;