var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNumber = require('graphql').GraphQLInt;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLScalarType = require('graphql').GraphQLScalarType;
var GraphQLJSON = require('graphql-type-json').GraphQLJSON;
var GraphQLBoolean = require('graphql').GraphQLBoolean;
var LikesModel = require('../../models/likes.js');
var PostModel = require('../../models/posts.js');
var CommentsModel = require('../../models/comments.js');

exports.feedPageContent = new GraphQLObjectType({
    name: 'feed_page',
    fields: function () {
      return {
        _id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },  
        post_media: { type: new GraphQLList(GraphQLJSON) },
        community_id: { type: GraphQLString },
        location: { type: new GraphQLList(GraphQLJSON) },
        updatedAt: {type: GraphQLString},
        comments_count: {type: GraphQLNumber},
        likes_count: {type: GraphQLNumber},
        has_next_page_flag: {type: GraphQLBoolean},
        has_prev_page_flag: {type: GraphQLBoolean},
        cursor: {type: GraphQLString},
        user_liked: {type: GraphQLBoolean},
        posted_user_prof_pic: {type: GraphQLString},
        posted_user_email: {type: GraphQLString},
        posted_user_name: {type: GraphQLString}
      }
    }
});
