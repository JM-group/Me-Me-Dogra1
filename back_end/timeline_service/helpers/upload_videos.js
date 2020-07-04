const fs = require("fs")
const path = require("path");
const multer = require("multer");
const SanitizeHelpers = require('./sanitizers.js')

// SET STORAGE
var storage = multer.diskStorage({
    /* destination: function (req, file, cb) {
      cb(null, 'uploads')
    }, */
    destination: 'post',
    filename: function (req, file, cb) {
      console.log("5557575755757575757575757575755755");
      //console.log(req);        
      cb(null, "random" + '-' + Date.now() + '.mov')
    }
})

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: { fieldSize: 2 * 4096 * 4096 }
    },
    fileFilter: function (req, file, cb) {
        console.log("inside file filter value going on here issssssssssssss");
        console.log(file);
        SanitizeHelpers(file, cb);
    }
}).single('file')

const uploadVideo = async (req, res) => {
    console.log("inside upload value hereeeeeeee");
    //console.log(req);
    return new Promise(function(resolve, reject){
        upload(req, res, function (err) {
            console.log("inside upload value hereee going on");
            if (err instanceof multer.MulterError) {
                console.log("1111111111111111111111111111111111");
                console.log(err);
                //return res.status(500).json(err)
                resolve(err)
            } else if (err) {
                console.log("222222222222222222222222222222222222222222");
                console.log(err);
                //return res.status(500).json(err)
                resolve(err);
            }
            console.log(req.file);
            console.log("22223333333");
            console.log(req.file.path);
            console.log("333333333333333333333333333333333333333333333333333333333333");
            resolve(req.file);
            //return req.file.path
        })    
    });    
}


module.exports = uploadVideo