var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNumber = require('graphql').GraphQLInt;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLArray = require('graphql').GraphQLArray;

let selectType = new GraphQLObjectType({
  name: 'selectType',
  fields: { 
      value: {type: GraphQLString},
      label: {type: GraphQLString}
  }
});
// User Type
exports.postLikesType = new GraphQLObjectType({
  name: 'likes',
  fields: function () {
    return {
      liked_by: {
        type: new GraphQLList(GraphQLString),
      },
      likes_count: {
        type: GraphQLNumber
      }
    }
  }
});

