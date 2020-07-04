var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNumber = require('graphql').GraphQLInt;
const UserModel = require('../../models/user.js');
const UserDetailsModel = require('../../models/user_details.js')
const FollowStatusModel = require('../../models/follow_status.js')
const FollowedUsersModel = require('../../models/followed_users')
const FollowingUsersModel = require('../../models/following_users')
var FollowersQueryTypes = require('../types/followers').followersTypes;
var FollowersQuery = require('./followers.js');

// Query
exports.userServiceQueryList = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      followers_data: FollowersQuery.user_followers,
      following_data: FollowersQuery.user_following,
      request_status: FollowersQuery.request_status
    }
  }
}); 


