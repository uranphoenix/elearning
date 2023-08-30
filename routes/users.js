const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validator = require("express-validator");

const User = require('../model/user');
const Student = require('../model/student');
const Instructor = require('../model/instructor');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id).then((user) => done(null, user)).catch((e) => done(e));
});

passport.use('local', new LocalStrategy({}, async (username, password, done) => {
    const user = await User.getUserByUsername(username);
    if(!user) {
      return done(null, false, {message: 'Unknown user'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
}))

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.post('/register', async function(req, res, next) {
  const first_name     	= req.body.first_name;
  const last_name     	= req.body.last_name;
  const street_address  = req.body.street_address;
  const city     		= req.body.city;
  const state    		= req.body.state;
  const zip     		= req.body.zip;
  const email    		= req.body.email;
  const username 		= req.body.username;
  const password 		= req.body.password;
  const password2 		= req.body.password2;
  const type            = req.body.type;

  // Form Validation
  await validator.body('first_name', 'First name field is required').notEmpty().run(req);
  await validator.body('last_name', 'Last name field is required').notEmpty().run(req);
  await validator.body('email', 'Email field is required').notEmpty().run(req);
  await validator.body('email', 'Email must be a valid email address').isEmail().run(req);
  await validator.body('username', 'Username field is required').notEmpty().run(req);
  await validator.body('password', 'Password field is required').notEmpty().run(req);
  await validator.body('password2', 'Passwords do not match').equals(req.body.password).run(req);

  const errors = validator.validationResult(req).array();

  if(errors.length !== 0){
    res.render('users/register', {
      msg: errors
    });
  } else {
    const newUser = new User({
      email: email,
      username: username,
      password: password,
      type: type
    });

    if(type === 'student') {
      console.log('Registering new student');
      const newStudent = new Student({
        first_name: first_name,
        last_name: last_name,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
        }],
        email: email,
        username: username
      });
      await User.saveStudent(newUser, newStudent);
      console.log('Student created');
    } else {
      console.log('Registering new instructor');
      const newInstructor = new Instructor({
        first_name: first_name,
        last_name: last_name,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
        }],
        email: email,
        username: username
      });
      await User.saveInstructor(newUser, newInstructor);
      console.log('Instructor created');
    }
    req.login(newUser, function(err) {
      if (err) { return next(err); }
      req.flash('success_msg', "Successfully registered");
      res.redirect('/' + type + 's/classes');
    });
  }
});

// noinspection JSCheckFunctionSignatures
router.post('/login', passport.authenticate('local',{failureRedirect: '/', failureFlash: true}), function (req, res, next) {
  req.flash('success_msg', "You are now logged in");
  const type = req.user.type;
  res.redirect('/' + type + 's/classes');
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if(err) { return next(err) }
    req.flash('success', "You have logged out");
    res.redirect('/');
  });
});

module.exports = router;
