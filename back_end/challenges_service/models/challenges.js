const mongoose = require('mongoose');

const challenges_schema = mongoose.Schema({
    user_id: String,
    community_id: String,
    name: String,
    profile_pic: Array,
    display_pic: Array,
    desc: String,
    tags: Array,
    demo_media: Array,
    attended_count: Number,
    privacy: Number,
    status: Boolean,
    due_date: Date,
    active_date: Date
}, {
    timestamps: true
});


module.exports = mongoose.model('challenges', challenges_schema);
