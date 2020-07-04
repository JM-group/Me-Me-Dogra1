const mongoose = require('mongoose');

const likes_schema = mongoose.Schema({
    post_id: String,
    media_id: {
        type: String,
        default: '0'
    },
    parent_comment_id: {
        type: String,
        default: '0'
    },
    comment_id: {
        type: String,
        default: '0'
    },
    liked_by: Array,
    likes_count: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('likes', likes_schema);


/*
    JSON to post likes

    {
        post_id: "",
        media_id: "",
        parent_comment_id: "",
        comment_id: "",
        liked_by: []
    }
    
*/