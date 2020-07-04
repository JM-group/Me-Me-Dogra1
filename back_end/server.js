const express = require('express');
const bodyParser = require('body-parser');
var async = require("async");
const graphqlHTTP = require("express-graphql");
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = require("graphql");

const cors = require("cors");
// create express app
const app = express();

app.use('*', cors());

// parse application/json
app.use(bodyParser.json({}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


app.use(bodyParser.raw({}))


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// define a default route
app.get('/', (req, res) => {
    console.log('inside resettt firsttt');
    res.send('NodeJS API')
});

const timelineSchema = require('./timeline_service/graphql/index').timelineSchema;
//const timelineSchema = require('./user_service/graphql/index').userServiceSchema;

app.use("/graphql", cors(), graphqlHTTP({
    schema: timelineSchema,
    rootValue: global,
    graphiql: true
}));

console.log("static file in server.js here isss ==")
console.log(express.static('post'))
console.log("444444444444");
console.log(express.static('public'));
app.use('/post', express.static('post'))
app.use('/uploads', express.static('uploads'))

require('./user_service/routes/user_routes.js')(app);
require('./timeline_service/routes/timeline_routes.js')(app);

var server=app.listen(3000,function() {
    console.log('listening hereeeee');
});