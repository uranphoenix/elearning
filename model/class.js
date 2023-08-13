const mongoose = require('mongoose');

const Class = module.exports = mongoose.model('class', new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    instructor: {
        type: String
    },
    lessons: [{
        lesson_number: {type: Number},
        lesson_title: {type: String},
        lesson_body: {type: String}
    }]
}));

module.exports.getClasses = async function(limit) {
    try {
        return await Class.find({}).limit(limit).lean();
    } catch (e) {
        console.log(`Error happened in class model: ${e.msg}`);
        throw e;
    }
}

module.exports.getClassById = async function(id) {
    try {
        return await Class.findById(id).lean();
    } catch (e) {
        console.log(`Error happened in class model: ${e.msg}`);
        throw e;
    }
}