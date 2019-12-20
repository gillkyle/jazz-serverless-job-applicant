'use strict';
const axios = require('axios')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const possibleEmails = [
  {
    title: `Your application just cruised into our portal!`,
    imgAlt: `Pug on a waverunner`,
    imgSrc: `http://giphygifs.s3.amazonaws.com/media/f3QMNe9NcFGjC/giphy.gif`,
  },
  {
    title: `We're reviewing your resumé-please hold.`,
    imgAlt: `Dog waiting on the phone`,
    imgSrc: `https://media.giphy.com/media/DiYQB5E4lfMmk/giphy.gif`,
  },
  {
    title: `Oh boy, we just got your resumé!`,
    imgAlt: `Excited chocolate lab`,
    imgSrc: `https://media.giphy.com/media/13ByqbM0hgfN7y/giphy.gif`,
  },
  {
    title: `Hang tight while we review your application`,
    imgAlt: `Dog swinging on exercise equipment`,
    imgSrc: `https://media.giphy.com/media/8TuD76qjyxeeI/giphy.gif`,
  },
  {
    title: `Giving your application a look over`,
    imgAlt: `Dog watching something on a computer`,
    imgSrc: `https://i.giphy.com/media/9rtpurjbqiqZXbBBet/giphy-downsized.gif`,
  },
  {
    title: `Evaluating your application-please hold.`,
    imgAlt: `Dog working on a computer`,
    imgSrc: `https://media.giphy.com/media/D1i1ZNUp2jVpC/giphy.gif`,
  },
]

module.exports.postApplication = async (event, context) => {
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  }
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
  console.log("Posting...")
  await axios
  .post(
    `https://api.resumatorapi.com/v1/applicants`,
    {
      ...body,
      apikey: process.env.GATSBY_JAZZHR_KEY,
    },
    {
      headers,
      params: {
        apiKey: process.env.GATSBY_JAZZHR_KEY,
      },
    }
  )
  .then(async result => {
    // use Sendgrid to fire off an email confirming it worked
    const randomEmail = possibleEmails[Date.now() % possibleEmails.length]
    const applicantEmail = body.email
    console.log(applicantEmail)
    const msgText = `Hi!
    Thank you for your interest in a role at Gatsby! We're reviewing your application and will be in touch.
    - The Gatsby Team`
    const msgHtml = `
      <div>Hi!</div>
      <br />
      <div>Thank you for your interest in a role at Gatsby! We're reviewing your application and will be in touch.</div>
      <br />
      <img alt=${randomEmail.imgAlt} style="height: 300px;" src=${randomEmail.imgSrc} />
      <br />
      - The Gatsby Team
    `
    const msg = {
      to: applicantEmail,
      from: 'jobs@gatsbyjs.com',
      subject: randomEmail.title,
      text: msgText,
      html: msgHtml,
    };
    await sgMail.send(msg)

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        message: 'JazzHR Application posted successfully',
      }),
    };
  })
  .catch(error => {
    console.log("---START ERROR---")
    console.log(error)
    console.log("---END ERROR---")
    return {
      headers,
      statusCode: 500,
      body: JSON.stringify({
        error,
        message: 'JazzHR Application failed to post',
      }),
    }
  })  
  console.log("Ending...")
};
