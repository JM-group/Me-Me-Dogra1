const UserModel = require('../models/user.js');
const UserDetailsModel = require('../models/user_details.js')
const FollowStatusModel = require('../models/follow_status.js')
const FollowedUsersModel = require('../models/followed_users')
const FollowingUsersModel = require('../models/following_users')


// Create and Save a new User
exports.create = async(req, res) => {
    recipient_user_id = req.body.recipient_id;
    recipient_user = await UserModel.findById(recipient_user_id)
    try {
            const follow_status_model = new FollowStatusModel({
                requestor_id: req.user._id,
                requestor: req.user,
                recipient: recipient_user,
                status: req.body.status
            });

            // Save 
            await follow_status_model.save()
            
            res.status(201).send({ follow_status_model })
    } catch (error) {
        res.status(400).send(error)
    }    
};

// Update or edit information about user
exports.update = async(req, res) => {
    if (req.body != 0) { 
        try {
            follow_status_model = await FollowStatusModel.findByIdAndUpdate(req.body.row_id, {$set:{
                status: req.body.status
            }})

            if (req.body.status == 3) {
                await FollowedUsersModel.findOneAndUpdate(
                    {user : req.user}, 
                    {
                    $push: { friends: follow_status_model.recipient._id }
                    }, function(err) {
                });

                await FollowingUsersModel.findOneAndUpdate(
                    {user: follow_status_model.recipient},
                    {
                        $push: { friends: req.user._id }
                    }        
                )  
            } 

            res.status(201).send(follow_status_model);
        } catch (error) {
            res.status(400).send(error)
        } 
    } else {
        await FollowStatusModel.findByIdAndRemove(req.params.row_id)
        res.status(201).send({'message': 'success'}); 
    }           
};
 
// Get details about user
exports.get = async(request, response) => {
    console.log('inside repsponse vlalalalallalalallllllllllllll');
    const user_follow_status = await FollowStatusModel.find({requestor: request.user}); 
    response.send(user_follow_status)
};


// Delete user / user details / follwers following entry
exports.delete = (req, res) => {
    FollowStatusModel.findByIdAndRemove(req.body.row_id)
    .then(festive => {
        if(!festive) {
            return res.status(404).send({
                message: "Record not found with id " + req.body.row_id
            });
        }
        res.send({message: "Record deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Record not found with id " + req.body.row_id
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.body.row_id
        });
    });
};


// Unfollow user after following 

exports.unfollow = async(req, res) => {
    try {
            await FollowedUsersModel.findOneAndUpdate(
                {user : req.user.id }, 
                {
                    $pull: { friends: req.body.removing_user_id }
                }, function(err) {

            });

            await FollowingUsersModel.findOneAndUpdate(
                {user: req.body.removing_user_id},
                {
                    $pull: { friends: req.user._id }
                }        
            )  
            
        res.status(201).send({'message': 'success'});
    } catch (error) {
        res.status(400).send(error)
    } 
}
