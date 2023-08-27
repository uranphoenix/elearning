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

module.exports.addLesson = async function(info) {
    const query = {_id: info.class_id};
    const update = {$push: {"lessons": {
        lesson_number: info.lesson_number,
        lesson_title: info.lesson_title,
        lesson_body: info.lesson_body
    }}};

    try {
        return await Class.findByIdAndUpdate(query, update, {safe: true, upsert: true});
    } catch (e) {
        console.log(`Error happened in class model: ${e.msg}`);
    }
}