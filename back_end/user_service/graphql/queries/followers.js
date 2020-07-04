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
var FollowerQueryType = require('../types/followers');


exports.user_followers = {
    type: new GraphQLList(FollowerQueryType.userFollowerContent),
    args: {
        _id: {
          name: '_id',
          type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function (root, params) {
      const filter_query = {_id: params._id};
      var response_val = '', user_val = '', temp_json = {};
      const user_data = await UserModel.findById(params._id).then(respo => {
        user_val = respo;
      })
      const post_data = await FollowedUsersModel.find({user: user_val._id}).populate('user').populate('friends').then(respo => {
        response_val = respo;
      });
      if (!response_val || !response_val[0]) {
        throw new Error('Error')
      } else {
        response_val[0]['friends_list'] = [];
        response_val[0].friends.forEach(function(resp){
            temp_json = {};
            temp_json['_id'] = resp._id;
            temp_json['email'] = resp.email;
            temp_json['profile_pic'] = resp.profile_pic;
            response_val[0]['friends_list'].push(temp_json)
        });
      }
      return response_val
    }
}

exports.user_following = {
  type: new GraphQLList(FollowerQueryType.userFollowerContent),
  args: {
      _id: {
        name: '_id',
        type: new GraphQLNonNull(GraphQLString)
      }
  },
  resolve: async function (root, params) {
    const filter_query = {_id: params._id};
    var response_val = '', user_val = '', temp_json = {};
    const user_data = await UserModel.findById(params._id).then(respo => {
      user_val = respo;
    })
    const post_data = await FollowingUsersModel.find({user: user_val._id}).populate('user').populate('friends').then(respo => {
      response_val = respo;
    });
    if (!response_val || !response_val[0]) {
      throw new Error('Error')
    } else {
      response_val[0]['friends_list'] = [];
      response_val[0].friends.forEach(function(resp){
          temp_json = {};
          temp_json['_id'] = resp._id;
          temp_json['email'] = resp.email;
          temp_json['profile_pic'] = resp.profile_pic;
          response_val[0]['friends_list'].push(temp_json)
      });
    }
    return response_val
  }
}



exports.request_status = {
  type: new GraphQLList(FollowerQueryType.userRequestStatusContent),
  args: {
      _id: {
        name: '_id',
        type: new GraphQLNonNull(GraphQLString)
      }
  },
  resolve: async function (root, params) {
    const filter_query = {'requestor': params._id};
    var response_val = '', user_val = '', temp_json = {};
    const user_data = await UserModel.find(filter_query).then(respo => {
      user_val = respo;
    })
    const post_data = await FollowStatusModel.find({user: user_val._id}).populate('requestor').populate('recipient').then(respo => {
    //  console.log('inside respo value going on isssssssssssrrrrrr');
    //  console.log(respo);
      response_val = respo;
    });
    console.log("response value finally isss sssssssssssssssssssssssssssssssss");
    console.log(response_val);
    if (!response_val || !response_val[0]) {
      throw new Error('Error')
    }
    return response_val
  }
}

