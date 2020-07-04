module.exports = (app) => {
    const post = require('../controllers/post_controller.js');
    const likes = require('../controllers/likes_controller.js');
    const comments = require('../controllers/comments_controller.js');
    const share = require('../controllers/share_controller.js');
    const auth = require('../middleware/auth.js');

    // Create a new Record / Signup

    app.post('/postMedia/:id', auth, post.uploadVideo);

    app.post('/post/:id', auth, post.create);

    // Update user details
    app.put('/post/:id/:post_id', auth,  post.update)
    
    //Update post type alone
    app.put('/post/type/:id/:post_id', auth, post.update_post_type)

    // Get user details and followers information
    app.get('/post/:id', post.get);

    // Delete a Note with festiveId
    app.delete('/post/:post_id/:id', auth, post.delete);   

    // Post comments for posts
    app.post('/comments/', comments.create);
    //app.post('/comments/:post_id/:parent_comment_id/', comments.create);

    // Update comment data 
    app.put('/comments/:id', comments.update)

    // Get specific comment details or subcomments
    app.get('/comments/:post_id/:parent_id', comments.get);

    // Delete a Note with festiveId
   // app.delete('/comments/:post_id', comments.deletePostComment);       

    // Delete a Note with festiveId
    app.delete('/comments/:id', comments.delete);       

    // Create a entry for post likes
    app.post('/likes/post/:id', auth, likes.createPostLikes);

    // Update post likes
    app.put('/likes/post/:id', likes.updatePostLikes);

    // Create a entry for comments likes
    app.post('/likes/comment/:id/:comment_id', likes.createCommentsLikes);

    // Create a entry for comments likes
    app.put('/likes/comment/:id/:comment_id', likes.updateCommentsLikes);
    
    // Get user details and followers information
    app.get('/likes/post/:id', likes.getPostLikes);

    // Delete a Note with festiveId
    app.get('/likes/comment/:id', likes.getCommentsLikes); 
    
    //Share posts routes
    //Create share post
    app.post('/share', share.create);

    //Update share post
    app.put('/share/:post_id', share.update);
}
