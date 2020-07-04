const mongoose = require('mongoose');

const user_details_schema = mongoose.Schema({
    user_id: String,
    first_name: String,
    last_name: String,
    gender: String,
    age: Number,
    profile_pic: String
}, {
    timestamps: true
});


module.exports = mongoose.model('user_details', user_details_schema);