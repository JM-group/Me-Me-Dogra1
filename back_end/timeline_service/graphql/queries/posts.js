var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
var LikesModel = require('../../models/likes.js');
var PostModel = require('../../models/posts.js');
var CommentsModel = require('../../models/comments.js');
var ShareModel = require('../../models/shares.js');
var UserModel = require('../../../user_service/models/user.js');
var postLikesType = require('../types/timeline').postLikesType;
var postContent = require('../types/posts');
var GraphQLNumber = require('graphql').GraphQLInt;


exports.post_initial_fetch_datas = {
    type: new GraphQLList(postContent.postInitialContent),
    args: {
        _id: {
          name: '_id',
          type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function (root, params) {
      const filter_query = {_id: params._id};
      var response_val = '';
      const post_data = await PostModel.find({_id: params._id}).populate('likes').populate('shares').then(respo => {
        response_val = respo;
      });
      console.log(response_val);
      if (!response_val) {
        throw new Error('Error')
      }
      return response_val
    }
}

exports.post_comments = {
  type: new GraphQLList(postContent.postCommentsType),
  args: {
    post_id: {
      name: 'post_id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: async function (root, params) {
    const filter_query = {post_id: params.post_id};
    var response_val = '';
    user_ids = [];
    const post_data = await CommentsModel.find({post_id: params.post_id}).populate('likes').then(respo => {
      respo.forEach(function(value){
        user_ids.push(value.user_id);
      });
      response_val = respo;
    });
    var user_val = {};
    const users_data = await UserModel.find({_id: user_ids}).then(user_respo => {
      user_respo.forEach(function(data){
        user_val[data._id] = {'display_name': data.display_name, 'profile_pic': data.profile_pic};
      });  
    });
    await response_val.forEach(function(value){
      value['user_data'] = user_val[value['user_id']]
    });
    if (!response_val) {
      throw new Error('Error')
    }
    return response_val
  }
}


exports.post_sub_comments = {
  type: new GraphQLList(postContent.postCommentsType),
  args: {
    post_id: {
      name: 'post_id',
      type: new GraphQLNonNull(GraphQLString)
    },
    parent_comment_id: {
      name: 'parent_comment_id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: async function (root, params) {
    const filter_query = {post_id: params.post_id};
    var response_val = '';
    user_ids = [];    
    const post_data = await CommentsModel.find({post_id: params.post_id, parent_comment_id: params.parent_comment_id}).populate('likes').then(respo => {
      respo.forEach(function(value){
        user_ids.push(value.user_id);
      });
      response_val = respo;
    });
    var user_val = {};
    const users_data = await UserModel.find({_id: user_ids}).then(user_respo => {
      user_respo.forEach(function(data){
        user_val[data._id] = {'display_name': data.display_name, 'profile_pic': data.profile_pic};
      });  
    });
    await response_val.forEach(function(value){
      value['user_data'] = user_val[value['user_id']]
    });
    if (!response_val) {
      throw new Error('Error')
    }
    return response_val
  }
}

exports.liked_users = {
  type: new GraphQLList(postContent.likedUsers),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLList(GraphQLString)
    }
  },
  resolve: async function (root, params) {
    var response_val = '';
    const post_data = await UserModel.find({_id: params._id}).then(respo => {
      response_val = respo;
    });
    if (!response_val) {
      throw new Error('Error')
    }
    return response_val
  }  
}