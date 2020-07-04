var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var queryType = require('./queries/user_service').userServiceQueryList;
//var mutation = require('./mutations/index');

/*const module_val = module.exports = {
  queryType
};
*/

exports.userServiceSchema = new GraphQLSchema({
  query: queryType,
/*  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutation
  })  */ 
})