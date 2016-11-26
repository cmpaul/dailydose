var aws = require('aws-sdk');

exports.handle = function(event, context) {
    var bucketName = process.env.S3_BUCKET;
    var params = {
        Destination: {
            ToAddresses: ["chris-daily-dose@googlegroups.com"]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Hello, world!"
                }
            },
            Subject: {
                Data: "Test Email"
            }
        },
        Source: "cmpaul@gmail.com"
    };
    var ses = new aws.SES({
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccesskey: process.env.SES_SECRET_ACCESS_KEY,
        region: process.env.SES_REGION
    });
    var email = ses.sendEmail(params, function(err, data) {
        if (err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);
            context.succeed(event);
        }
    });
    console.log("EMAIL: " + email);
}
