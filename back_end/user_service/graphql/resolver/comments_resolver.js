var promisify = require('../../helpers/promisify.js');
var LikesModel = require('../../models/likes.js');
var GraphQLObjectType = require('graphql').GraphQLObjectType;

const resolvers = {
    commentLikes: (_, args) => promisify(.findById(args.id)),
};

//export default resolvers;

exports.commentsResolver = new GraphQLObjectType({
    resolver
});
