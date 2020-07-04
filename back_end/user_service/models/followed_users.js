const mongoose = require('mongoose');

const followed_users_schema = mongoose.Schema({
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true
});

module.exports = mongoose.model('followed_users', followed_users_schema);