const mongoose = require('mongoose');

const shares_schema = mongoose.Schema({
    post_id: String,
    shared_users_id: Array,
    media_id: Array,
    count: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('shares', shares_schema);
 

/*
    JSON to post shares

    {
        id: "",
        shared_users_id: [12, 13]
    }

*/