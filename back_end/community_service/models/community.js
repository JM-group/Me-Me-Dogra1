const mongoose = require('mongoose');

const community_schema = mongoose.Schema({
    user_id: String,
    name: String,
    profile_pic: Array,
    display_pic: Array,
    desc: String,
    tags: Array
}, {
    timestamps: true
});


module.exports = mongoose.model('community', community_schema);
