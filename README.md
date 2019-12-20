# Serverless Jazz HR Connection

This function is deployed using the [Serverless framework](https://serverless.com/) to AWS Lambda. 

Because the v1 of Jazz's HR API can only be used in a server environment this function is the connection between the careers posted on Gatsbyjs.com and Gatsby's account on the Jazz portal.

## What it does

The function in `handler.js` simply forwards the data received from the JazzHrForm component on .com on to Jazz's post applicant endpoint.

The API has some limitations like only being able to post to specific fields (custom fields and workflows defined by a user aren't "postable", of which we have several), meaning some fields get posted to other fields that are generally unused as a work around. What fields did and did not work were mostly ascertained by guess and check since it's not documented by Jazz.

## Deploying

First, verify that you have added a `.env` file at the root of the project with the API keys for Jazz and Sendgrid:

```
GATSBY_JAZZHR_KEY=r4nd0mjumbledch4rs
SENDGRID_API_KEY=SG.r4nd0mjumbledch4rs.evenM0aRch4rs
```

The whole function can be deployed after installing serverless globally with:

```sh
serverless deploy
```

The above command will deploy to a `dev` environment on Lambda. To deploy to `prod` use:

```sh
serverless deploy --stage prod
```

A successful deployment will return a message like this:

```
Service Information
service: jazz
stage: prod
region: us-east-1
stack: jazz-prod
resources: 17
api keys:
  None
endpoints:
  POST - https://a8wsdc02xk.execute-api.us-east-1.amazonaws.com/prod/postApplication
```

The endpoint is what is hit by .com to send the form data for an applicant to the function.

If you have made updates to the `serverless.yml` file you need to use the above commands, but if you want to deploy changes to a function, like the `postApplication` function in `handler.js`, you can run:

```sh
serverless deploy --stage prod --function postApplication
```

Which would be deployed to `prod` because of the `--stage` flag.

## Developing

The function can be invoked locally, and you can pass in mock data from a file like `data.json` with this command:

```sh
serverless invoke local --function postApplication --path data.json
```
