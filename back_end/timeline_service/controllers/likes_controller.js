const PostModel = require('../models/posts.js');
const LikesModel = require('../models/likes.js')
const CommentsModel = require('../models/comments.js');  
const ShareModel = require('../models/shares.js');

// Create a post 
exports.createPostLikes = async(req, res) => {
    var row_exists = false, query = { _id: req.body.post_id }, likes_data_object, currentLikesCount, row_length = 0;
    try {
        await LikesModel.find({post_id : req.body.post_id}, function (err, docs) {
            row_length = docs.length
        });
        if (req.body.action) {
            likes_data_object = new LikesModel({
                post_id: req.body.post_id,
                liked_by:[req.user._id],
                likes_count: 1,
            });
            await likes_data_object.save();
            await PostModel.findByIdAndUpdate(req.body.post_id, {$set:{
                likes_count: row_length + 1,
            }})    
        } else {
            LikesModel.findOneAndDelete({ post_id: req.body.post_id, liked_by: [req.user._id] }, function (err) {
                if(err) console.log(err);
                console.log("Successful deletionnnnnnnnnnnnnnnn");
            });

            if (req.body.action) {
                var likeCountVal = { $set: {likes_count: row_length + 1 }}
                await PostModel.updateOne(query, likeCountVal, function(err, response) {
                    if (err) throw res.status(401).send(err);
                });
            } else {
                var likeCountVal = { $set: {likes_count: row_length - 1 }}
                await PostModel.updateOne(query, likeCountVal, function(err, response) {
                    if (err) throw res.status(401).send(err);
                });
            }    
        }   
        res.status(201).send({ likes_data_object })
    } catch (error) {
        res.status(400).send(error)
    }
}; 


// Update post likes 
exports.updatePostLikes = async(req, res) => {
    var currentLikesCount = await LikesModel.find({post_id : req.body.post_id});
    var query = { post_id: req.body.post_id };
    if (req.body.action) {
        var values = { $set: {likes_count: currentLikesCount[0].likes_count || currentLikesCount[0].likes_count == 0 ? currentLikesCount[0].likes_count + 1 : 0 },
            $push: {liked_by: req.body.liked_by} };    
    } else {    
        var values = { $set: {likes_count: currentLikesCount[0].likes_count && currentLikesCount[0].likes_count > 0 ? currentLikesCount[0].likes_count - 1 : 0 },
            $pull: {liked_by: req.body.liked_by} };
    }
    LikesModel.updateOne(query, values, function(err, response) {
      if (err) throw res.status(401).send(err);
    });   
    await PostModel.updateOne(query, values, function(err, response) {
        if (err) throw res.status(401).send(err);
    });
    res.status(201).send({ "status": "Successfuly updated likes" })    
}; 


// Update or edit information about user
exports.createCommentsLikes = async(req, res) => {
    try {
            const likes_data_object = new LikesModel({
                post_id: req.params.id,
                comment_id: req.params.comment_id,
                parent_comment_id:req.body.parent_comment_id,
                liked_by:req.body.liked_by,
                likes_count: req.body.liked_by.length,
            });
 
            // Save   
            await likes_data_object.save()
             
            res.status(201).send({ likes_data_object })
    } catch (error) {
            res.status(400).send(error)
    }
};

// Update or edit information about user
exports.updateCommentsLikes = async(req, res) => {
    var query = { post_id: req.params.id, comment_id: req.params.comment_id };
    var values = { $set: {liked_by:req.body.liked_by, likes_count: req.body.liked_by.length } };
    LikesModel.updateOne(query, values, function(err, response) {
        if (err) throw res.status(401).send(err);;
        console.log("1 document updated");
        res.status(201).send({ "status": "Successfuly updated likes" })
    });   
};


//Get Post Object
exports.getPostLikes = async(req, res) => {
    try {
        const likes_data_object = await LikesModel.findById(req.params.id);
        res.status(201).send({ likes_data_object })        
    } catch (error) {
        res.status(400).send(error)
    }
};    


//Get Post Object
exports.getCommentsLikes = async(req, res) => {
    try {
        const post_data_object = await LikesModel.findById(req.params.id);
        res.status(201).send({ post_data_object })        
    } catch (error) {
        res.status(400).send(error)
    }
};    


 