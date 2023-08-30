const mongoose = require('mongoose');

const Student = module.exports = mongoose.model('Student', new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    address: [{
        street_address:{type: String},
        city:{type: String},
        state:{type: String},
        zip:{type: String}
    }],
    username: {
        type: String
    },
    email: {
        type: String
    },
    classes:[{
        class_id:{type: [mongoose.Schema.Types.ObjectId]},
        class_title: {type:String}
    }]
}));

module.exports.getByUsername = async function(username) {
    try {
        return await Student.findOne({username: username}).lean();
    } catch(e) {
        console.log(e.msg);
        throw e;
    }
}

module.exports.register = async function(info) {
    const query = {username: info.student_username};
    const update = {$push: {"classes": {class_id: info.class_id, class_title: info.class_title}}};
    try {
        return await Student.findOneAndUpdate(query, update, {safe: true, upsert: true});
    } catch(e) {
        console.log(e.msg);
        throw e;
    }
}