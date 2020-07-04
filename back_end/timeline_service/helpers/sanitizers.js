const jwt = require('jsonwebtoken')

const sanitizeFile = (file, cb) => {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif', 'heic', 'mov', 'MOV']
    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    console.log("is allowed ext ==", isAllowedExt);
    // Mime type must be an image
    //let isAllowedMimeType = file.mimetype.startsWith("image/")
    if (isAllowedExt) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }

}
module.exports = sanitizeFile
