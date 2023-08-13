const express = require('express');
const router = express.Router();

const Class = require('../model/class');

/* GET home page. */
router.get('/', function(req, res, next) {
  Class.getClasses(3).then((classes) => {
    res.render('index', { classes: classes });
  });

});

module.exports = router;
