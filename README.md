# dailydose
Lambda that emails my news digest on a daily basis.

## Installation

1. Install [apex](http://apex.run/)
1. Create an [IAM policy and user](https://github.com/apex/apex/blob/master/docs/aws-credentials.md#minimum-iam-policy)
1. Deploy to AWS

    ```bash
    apex deploy -s SES_ACCESS_KEY_ID=<KEY> \
        -s SES_SECRET_ACCESS_KEY=<SECRET> \
        -s SES_REGION=us-east-1 \
        -s FROM_ADDR=<SENDER_EMAIL> \
        -s TO_ADDR=<RECIPIENT_EMAIL>
    ```

## TODO
* [ ] Use an HTML template
* [ ] Get env.json working so I can remove the command line environment variable params
* [ ] Get a text version of the email working
* [ ] Move `sources` out of file
* [ ] DRY out index.js
