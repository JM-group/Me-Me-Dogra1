const mongoose = require('mongoose');

const follow_status_schema = mongoose.Schema({
    requestor_id: String,
    requestor: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('follow_status', follow_status_schema);