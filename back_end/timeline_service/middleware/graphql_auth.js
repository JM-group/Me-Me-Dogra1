const jwt = require('jsonwebtoken')
const User = require('../../user_service/models/user.js')

const auth = async(params) => {
    console.log("valueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    console.log(params);
    const token = params.token;
    console.log(token);
    var data = '';
    try {
        console.log("inside try block hereeeee");
        if (token && token != '0') {
            console.log("inside first iffff");
            console.log('inside auth value coming here is ssss goig onnnnnn');
            data = jwt.verify(token, 'lorem')
            console.log("before findin user ==", data);
            const user = await User.findOne({ _id: data._id, 'tokens.token': token })
            //console.log(user);
            console.log("//////////////////////////////");
            return user
        } else {
            console.log("inside second ifff heree");
            return null;
        }    
    } catch (error) {
        console.log("catch errir heredsfsfs");
        //res.status(401).send({ error: 'Not authorized to access this resource' })
        return null
    }

}
module.exports = auth









