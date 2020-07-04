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
      cb(null, "random" + '-' + Date.now())
    }
})

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: { fieldSize: 2 * 1024 * 1024 }
    },
    fileFilter: function (req, file, cb) {
        SanitizeHelpers(file, cb);
    }
}).single('file')

const uploadVideo = (req, res) => {
    console.log("inside upload value hereeeeeeee");
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("1111111111111111111111111111111111");
            console.log(err);
            return res.status(500).json(err)
        } else if (err) {
            console.log("222222222222222222222222222222222222222222");
            console.log(err);
            return res.status(500).json(err)
        }
        return req.file.path
    })    
}