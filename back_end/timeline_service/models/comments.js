const mongoose = require('mongoose');

const comments_schema = mongoose.Schema({
    post_id: String,
    media_id: String,
    parent_comment_id: String,
    user_id: String,
    comment_text: String,
    media: Array,
    tags: Array,
    replies_count: Number,
    likes_count: Number,
    share_count: Number
}, {
    timestamps: true
});

comments_schema.virtual('likes', {
    ref: 'likes', 
    localField: '_id',
    foreignField: 'comment_id', 
    justOne: false
});

module.exports = mongoose.model('comments', comments_schema);



/* JSON strcuture to create comment
    {
        "comment": {
            "post_id": "1223344556677890",
            "media": ["https://www.facebook.com/", "https://www.google.com/"],
            "parent_comment_id": "0",
            "user_id": "5d965ff79ca33c5703f16451",
            "comment_text": "Hi Hi Comment",
            "tags": [{
                "user_id": "123",
                "text": ""
            }, {
                "user_id": "456",
                "text": ""
            }]
        }
    }
*/
