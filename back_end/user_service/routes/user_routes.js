module.exports = (app) => {
    const user = require('../controllers/user_controller.js');
    const follow = require('../controllers/follow_controller.js');    
    const auth = require('../middleware/auth.js');

    // Create a new Record / Signup
    app.post('/login', user.login);

    app.post('/user', user.create);

    // Update user details
    app.put('/user/:id', auth, user.update);

    // Get user details and followers information
    app.get('/user/:id', auth, user.get);

    app.get('/user/post/:id', auth, user.getPostedData);
    
    //Logout / Logout user from all devices
    app.post('/logout/:id', auth, user.logout);
    
    app.post('/logout_all/:id', auth, user.logout_all);

    // Delete a Note with festiveId
    app.delete('/user/:id', user.delete);

    //Upload profile pic
    app.post('/upload_profile_pic/:id', auth, user.upload_images);


    app.post('/follow/:id', auth, follow.create)
   
    app.put('/follow/:id', auth, follow.update)

    app.get('/follow/:id', auth, follow.get)

    app.delete('/follow/:id', auth, follow.delete)

    app.put('/unfollow/:id', auth, follow.unfollow)
}
