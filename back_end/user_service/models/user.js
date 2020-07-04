const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const envFile = require('../env.js');

mongoose.set('useCreateIndex', true);

const user_schema = mongoose.Schema({
    email: { type: String, required: true, unique: true, dropDups: true, lowercase: true},
    ph_number: Number,
    auth_token: String,
    refresh_token: String,
    first_name: String,
    last_name: String,
    display_name: String,
    gender: String,
    age: Number,
    dob: {
        type: Date,
        // The dates of the first and last episodes of
        // Star Trek: The Next Generation
        min: '1920-01-01',
        max: '2012-12-31'
    }, 
    country: String,
    country_code: String,
    profile_pic: String,
    status: Boolean, 
    tokens: [{
        token: {
            type: String,
            required: true
        } 
    }]
}, {
    timestamps: true
});

user_schema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    console.log('entering generate auth method inside here');
    const user = this;
    console.log(user._id);
    const token = jwt.sign({_id: user._id}, envFile['secret'])
    console.log('token valueeeee is ==', token);
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}  

//    return token
user_schema.statics.findByCredentials = async (email, token) => {
    // Search for a user by email and password.
    const users = await User.findOne({ email} )
    if (!users) {
      // throw new Error({ error: 'Invalid login credentials' })
    } 
    return users
}


user_schema.virtual('follow_status', {
    ref: 'follow_status', 
    localField: '_id',
    foreignField: 'requestor_id', 
    justOne: false
});

const User = mongoose.model('user', user_schema);
module.exports = User
