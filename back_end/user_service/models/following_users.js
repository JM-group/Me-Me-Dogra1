const mongoose = require('mongoose');

const following_users_schema = mongoose.Schema({
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true
});

module.exports = mongoose.model('following_users', following_users_schema);