# dailydose
Lambda that emails my news digest on a daily basis.

## Installation

1. Install [apex](http://apex.run/).
1. Create an IAM policy and user.
1. Deploy to AWS

## Deploy

```bash
apex deploy -s SES_ACCESS_KEY_ID=<KEY> \
    -s SES_SECRET_ACCESS_KEY=<SECRET> \
    -s SES_REGION=us-east-1 \
    -s FROM_ADDR=<SENDER_EMAIL> \
    -s TO_ADDR=<RECIPIENT_EMAIL>
```
