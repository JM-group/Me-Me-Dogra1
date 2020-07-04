const jwt = require('jsonwebtoken')

const sanitizeFile = (file, cb) => {
    // Define the allowed extension
    console.log("//////////////////////////////////////////////////////");
    let fileExts = ['png', 'jpg', 'jpeg', 'gif', 'heic', 'mov', 'MOV']
    // Check allowed extensions
    console.log(file.originalname);
    console.log(file.originalname.split('.')[1].toLowerCase());
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    console.log("is allowed ext ==", isAllowedExt);
    // Mime type must be an image
    //let isAllowedMimeType = file.mimetype.startsWith("image/")
    if (isAllowedExt) {
        console.log("1111111111111111111111111111111111111111111111");
        return cb(null, true) // no errors
    }
    else {
        console.log("222222222222222222222222222222222222222222222222");
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }

}

module.exports = sanitizeFile
