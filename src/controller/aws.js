const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

// this function will upload file to aws and return the link
// we will be using the s3 service of aws

exports.uploadFile = async (file) => {
    
    return new Promise( (resolve, reject) => {

        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); 

        let uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "profiles/" + file.originalname, 
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {

            if (err) return reject({ "error": err })
            
            return resolve(data.Location)
        })
    })
}


