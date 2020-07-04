var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNumber = require('graphql').GraphQLInt;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLScalarType = require('graphql').GraphQLScalarType;
var GraphQLJSON = require('graphql-type-json').GraphQLJSON;
var LikesModel = require('../../models/likes.js');
var PostModel = require('../../models/posts.js');
var CommentsModel = require('../../models/comments.js');

exports.postInitialContent = new GraphQLObjectType({
    name: 'post',
    fields: function () {
      return {
        description: { type: GraphQLString },  
        post_media: { type: new GraphQLList(GraphQLJSON) },
        community_id: { type: GraphQLString },
        location: { type: new GraphQLList(GraphQLJSON) },
        updatedAt: {type: GraphQLString},
        comments_count: {type: GraphQLNumber},
        likes: {
          type: postLikesType,
          resolve: function (root, params) {
            return root.likes[0] 
          }  
        },
        share_data: {
          type: shareDataType,
          resolve: function (root, params) {
            return root.shares[0];
          }
        }
      }
    }
});

exports.postCommentsType = new GraphQLObjectType({
    name: 'comments',
    fields: function () {
      return {
        _id: {type: GraphQLString},
        parent_comment_id: {type: GraphQLString},
        comment_text: {type: GraphQLString},
        media: {type: new GraphQLList(GraphQLString)},
        tags: {type: new GraphQLList(GraphQLString)},
        replies_count: {type: GraphQLNumber},
        updatedAt: {type: GraphQLString},
        likes_count: {type: GraphQLNumber},
        share_count: {type: GraphQLNumber},
        user_data: {type: GraphQLJSON},
        likes: {
          type: commentsLikesType,
          resolve: function (root, params) {
            return root.likes[0] 
          }  
        }
      }
    }
});

const postLikesType = new GraphQLObjectType({
    name: 'post_likes',
    fields: function () {
      return {
        post_id: {type: GraphQLString },
        liked_by: {type: new GraphQLList(GraphQLString)},
        likes_count: {type: GraphQLNumber}
      }
    } 
});

const commentsLikesType = new GraphQLObjectType({
  name: 'comment_likes',
  fields: function () {
    return {
      comment_id: {type: GraphQLString },
      post_id: { type: GraphQLString },
      liked_by: {type: new GraphQLList(GraphQLString)},
      likes_count: {type: GraphQLNumber},
      parent_comment_id: {type: GraphQLString }      
    }
  } 
});

const shareDataType = new GraphQLObjectType({
  name: 'shares_data',
  fields: function () {
    return {
      count: {type: GraphQLNumber},
      shared_users_id: {type: new GraphQLList(GraphQLString)}  
    }
  } 
});

exports.likedUsers = new GraphQLObjectType({
  name: 'liked_users',
  fields: function () {
    return {
      display_name: {type: GraphQLString },
      profile_pic: {type: GraphQLString }
    }
  } 
})  

//exports.postCommentsType = {postCommentsType}