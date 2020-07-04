var promisify = require('../../helpers/promisify.js');
var LikesModel = require('../../models/likes.js');
var GraphQLObjectType = require('graphql').GraphQLObjectType;

const resolvers = {
    postLikes: (_, args) => promisify(LikesModel.findById(args.id)),
};

exports.postResolver = new GraphQLObjectType({
    resolvers
});
