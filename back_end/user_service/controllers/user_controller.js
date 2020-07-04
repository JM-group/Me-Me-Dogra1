const UserModel = require('../models/user.js');
const UserDetailsModel = require('../models/user_details.js')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const FollowStatusModel = require('../models/follow_status.js')
const FollowedUsersModel = require('../models/followed_users')
const FollowingUsersModel = require('../models/following_users')
const SanitizeHelpers = require('../helpers/sanitizers.js')
const PostModel = require('../../timeline_service/models/posts')
const fs = require("fs")
const path = require("path");
const multer = require("multer");
  
// SET STORAGE
var storage = multer.diskStorage({
    /* destination: function (req, file, cb) {
      cb(null, 'uploads')
    }, */
    destination: 'uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
})

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: { fieldSize: 2 * 1024 * 1024 }
    },
    fileFilter: function (req, file, cb) {
        //sanitizeFile(file, cb);
        SanitizeHelpers(file, cb);
    }
}).single('file')

// Create and Save a new User
exports.create = async(req, res) => {
    try {
       // UserModel.init().then(() => {
            const user_data_object = new UserModel({
                email: req.body.email,
                ph_number: req.body.ph_number,
                auth_token:req.body.auth_token,
                refresh_token:req.body.refresh_token,
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                gender:req.body.gender,
                age:req.body.age,
            });

            // Save 
            await user_data_object.save()
            
            await new FollowedUsersModel({
                user: user_data_object,
               // friends: follow_status_model.recipient._id
            }).save()

            await new FollowingUsersModel({
                user: user_data_object,
            }).save()

            const token = await user_data_object.generateAuthToken()
           res.status(201).send({ user_data_object })
    } catch (error) {
        console.log('33333333333333333333333333333333333');
        console.log(error);
        res.status(400).send(error)
    }    
};

/*
   JSON structure to create user
   {
        "email": "mashif2134@gmail.com",
        "ph_number": 16478037288,
        "auth_token": "156a",
        "refresh_token": "5679",
        "first_name": "Mohamed",
        "last_name": "12355Ashif",
        "gender": "Male",
        "age": 22,
        "profile_pic": PHOTOURL
    }

*/

exports.login = async(req, res) => {
    var user_data_object = await UserModel.findByCredentials(req.body.email);
    if (!user_data_object) {
        console.log('inside first ifff');
        user_data_object = new UserModel({
            email: req.body.email,
            ph_number: req.body.ph_number,
            auth_token:req.body.auth_token,
            refresh_token:req.body.refresh_token,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            gender:req.body.gender,
            age:req.body.age,
            profile: req.body.profile_pic,
            display_name: req.body.display_name
        });

        await user_data_object.save()
        const token = await user_data_object.generateAuthToken()
        res.status(201).send({ user_data_object })
        /*    .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the record."
            });
        });  */
    } else {
        console.log('inside 222333');
        user_data_object.status = true;
        const token = await user_data_object.generateAuthToken();
        console.log(token);
        res.status(201).send({ user_data_object })
        // res.send({ user, token });
    }
}



// Update or edit information about user
exports.update = (req, res) => {
   // UserModel.find({email: req.params.id}, {$set:{
    console.log("inside update value hereee /////");
    console.log(req.body);
    console.log("req.id ==", req.params);
    console.log("req.parmas ==", req.params.id);
    
    var parts =req.body.dob.split('-');
    var mydate = new Date(req.body.dob); 
    console.log("parsed value iss <<<<<<>>>>>> //// ==", mydate.toDateString());
    req.user.updateOne({$set:{
        ph_number: req.body.ph_number,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        gender:req.body.gender,
        age:req.body.age,
        display_name: req.body.display_name,
        country: req.body.country,
        dob: mydate,
        gender: req.body.gender,
        country_code: req.body.country_code
    }}).then(data => {
        console.log("after then value hereeeeeeeeee");
        console.log(data);
        if(!data) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });
        }
        console.log("req.user vaue here iss == ///////////<<<<<>>>>>");
        res.send(req.user);
    }).catch(err => {
        console.log("inside catch error block hereee");
        console.log(err);
        if(err.kind === 'ObjectId') {
            console.log("11111111");
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        console.log("or otherwise hereee going onnn");
        return res.status(500).send({
            message: "Error updating record with id " + req.params.id
        });
    });
};

// Get details about user
exports.get = (request, response) => {
    console.log('inside repsponse vlalalalallalalallllllllllllll');
    response.send(request.user)
};

//Get user data with post data
exports.getPostedData = async(request, response) => {
    console.log('inside repsponse vlalalalallalalallllllllllllll /////');
    var responseVal = {}
    var postVal = await PostModel.find({user_id: request.user._id}).select('likes_count _id post_media post_type description');
    responseVal = {
        first_name: request.user.first_name,
        last_name: request.user.last_name,
        profile_pic: request.user.profile_pic,
        gender: request.user.gender,
        country: request.user.country,
        dob: request.user.dob,
        postVal: postVal
    }
    //response.send(request.user)
    response.send(responseVal)
};

// Delete user / user details / follwers following entry
exports.delete = (req, res) => {
    UserModel.findByIdAndRemove(req.params.id)
    .then(festive => {
        if(!festive) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.festiveId
            });
        }
        res.send({message: "Record deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.festiveId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.festiveId
        });
    });
};

//Logout user form his/her device
exports.logout = async(req, res) => {
    //const user = await UserModel.findByCredentials(req.body.email);
    const user = req.user;
    //console.log("very first heree");
    //console.log(user.tokens);
    if (user) {
        try {
            user.tokens = user.tokens.filter((token) => {
                return token.token != req.params.id
            })
            //console.log("after filter heree");
            //console.log(user.tokens);
            await user.save({status: 0, tokens: user.tokens})
            res.send({'message': 'Successfully logged out'});
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.send({ 'error': 'No such user exist in this email' });
    }    
};

//Logout user from all his devices
exports.logout_all = async(req, res) => {
    const user = await UserModel.findByCredentials(req.body.email);
    if (user) {
        try {
            user.tokens.splice(0, user.tokens.length)
            await user.save()
            res.send({message: 'Successfully Logged out from all devices'});
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.send({'error': 'No such user exist in this email'})
    }    
};


exports.upload_images = async(req, res) => {
    console.log("^^^^^^^^^^^^^^^^^^^^^");
    console.log(req);
    console.log("983281312838123812381273812381273812738127381273812387123871287381273");
    console.log(req.body);
    console.log(req.file);
    console.log("////////////////////////////////////////////////////////////////////////////");
    upload(req, res, function (err) {
            console.log("before upload req value iss");
            //console.log(req);
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            req.user.profile_pic = req.file.path
            console.log(req.file.path);
            req.user.save()
            return res.status(200).send(req.file)
    })
}

