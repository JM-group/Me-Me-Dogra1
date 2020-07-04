const mongoose = require('mongoose');

const post_schema = mongoose.Schema({
    user_id: String,
    description: String,
    post_media: Array,
    post_type: Number,  // Visibility mode for post public = 1/private = 0
    community_id: String,
    location: Array,
    likes_count: Number,
    comments_count: Number,
    ingredients:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'comments'}
    ]
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

post_schema.virtual('likes', {
    ref: 'likes', 
    localField: '_id',
    foreignField: 'post_id', 
    justOne: false
});

post_schema.virtual('comments', {
    ref: 'comments', 
    localField: '_id',
    foreignField: 'post_id', 
    justOne: false
});

post_schema.virtual('shares', {
    ref: 'shares', 
    localField: '_id',
    foreignField: 'post_id', 
    justOne: false
});

module.exports = mongoose.model('post', post_schema);



/*

// Json format to create post

{
	"user_id": "12",
	"community_id": "16",
	"description": "lorem Epsom",
	"location": [],
	"post_media": [{
		"id": "",
		"media_url": "",
		"tags": [{
			"co_ords": [],
			"user_name": "",
			"place_name": ""
		}, {
			"co_ords": [],
			"user_name": "",
			"place_name": ""
		}]
	}]
}


*/



/*

    {
        "comment": {
            "post_id": "5678",
            "media": ["https://www.facebook.com/", "https://www.google.com/"],
            "parent_comment_id": "5d9cc2d820633f9202fdfd83",
            "user_id": "5d965ff79ca33c5703f16451",
            "comment_text": "Hi Hi 888 Comment",
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