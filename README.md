# dailydose
Lambda that emails my news digest on a daily basis.

<img src="/screenshot.png?raw=true" width="300" alt="Sample email" title="Sample email" />

## Installation

1. Install [apex](http://apex.run/)
1. Create an [IAM policy and user](https://github.com/apex/apex/blob/master/docs/aws-credentials.md#minimum-iam-policy)
1. Copy [env.json.sample](/env.json.sample) to env.json and update with the correct environment values
1. Deploy to AWS

    ```bash
    apex deploy -E env.json
    ```

## TODO
* [ ] Use an HTML template
* [x] Get env.json working so I can remove the command line environment variable params
* [ ] Get a text version of the email working
* [ ] Move `sources` out of file
* [ ] DRY out index.js
* [ ] Slackbot
* [ ] Recommendation service based on links clicked
