const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = module.exports = mongoose.model(
    'User',
    new mongoose.Schema({
        username: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String,
            bcrypt: true
        },
        type: {
            type: String
        }
    })
);

//get user by unique id
module.exports.getUserById = async function(id) {
    try {
        return User.findById(id);
    } catch(e) {
        console.log(`Error happened: ${e.msg}`);
        throw e;
    }
}

module.exports.getUserByUsername = async function(username) {
    try {
        return await User.findOne({username: username});
    } catch(e) {
        console.log(e.msg);
        throw e;
    }
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (error, isMatch) => {
        callback(error, isMatch)
    });
}

//create student user
module.exports.saveStudent = async function(newUser, newStudent) {
    //set student hash
    newUser.password = await bcrypt.hash(newUser.password, 10);
    console.log('Student is being saved');
    Promise.all([newUser.save(), newStudent.save()])
        .then((results) => {
            return results
        })
        .catch((e) => {
            console.log(`Error happened in user model: ${e.msg}`);
            throw e;
        })
}

module.exports.saveInstructor = async function(newUser, newInstructor) {
    //set instructor hash
    newUser.password = await bcrypt.hash(newUser.password, 10);
    console.log('Instructor is being saved');
    Promise.all([newUser.save(), newInstructor.save()])
        .then((results) => {
            return results
        })
        .catch((e) => {
            console.log(`Error happened in user model: ${e.msg}`);
            throw e;
        })
}