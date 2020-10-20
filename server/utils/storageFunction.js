const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');

//Create storage engine 
const storageFunction = function (collectionName, mongoURI) {

    const storage = new GridFsStorage({
        url: mongoURI,
        file: (req, file) => {
    
        return new Promise((resolve, reject) => {
    
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
    
                console.log('err reject');
                return reject(err);
            } else {

                
                const filename = file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: collectionName
                };
                console.log('resolve :', filename,fileInfo);
        
                resolve(fileInfo);
            }
            });
        });
        }
    });
    const event = multer({ storage : storage });
    return(event);
} 

module.exports = storageFunction;