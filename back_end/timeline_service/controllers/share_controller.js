const PostModel = require('../models/posts.js');
const LikesModel = require('../models/likes.js')
const CommentsModel = require('../models/comments.js');  
const ShareModel = require('../models/shares.js');

// Create a post 
exports.create = async(req, res) => {
    try {
        const share_data_object = new ShareModel({
        post_id: req.body.post_id,
        shared_users_id: req.body.shared_users_id,
        count: req.body.shared_users_id.length
    });
 
        // Save 
        await share_data_object.save()
        
        res.status(201).send({ share_data_object })
    } catch (error) {
        res.status(400).send(error)
    }
};
 

// Create a post  
exports.update = async(req, res) => {
    console.log("inside update enfksdnfsfsnfsnfnsdfjnsnfsnfsnjdfsd");
    console.log(req.body.shared_users_id.length);
    var arr_len = req.body.shared_users_id.length;
        await ShareModel.updateOne(
            // find record with name "MyServer"
            { post_id: req.params.post_id },
            // Concat new values into exising array and increase count value
            { 
                $inc: { 
                    count: arr_len 
                }, 
                $push: { shared_users_id: { 
                            $each: req.body.shared_users_id 
                        }
                }
            }, 
        ).exec();
        res.status(201).send({ 'status': 'Successfully updated' });
};