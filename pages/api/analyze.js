// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { google } = require('googleapis');

const API_KEY = process.env.PERSPECTIVE_API_KEY;
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

export default (req, res) => {
  // console.log("runs")
  switch (req.method) {
    case "POST":
      const text = req.body.text
      // console.log("text", text)
      google.discoverAPI(DISCOVERY_URL)
        .then(async client => {
          const analyzeRequest = {
            comment: {
              text,
            },
            requestedAttributes: {
              TOXICITY: {},
              IDENTITY_ATTACK: {},
              INSULT: {},
              PROFANITY: {},
              THREAT: {},
              FLIRTATION: {}
            },
          };

          await client.comments.analyze(
            {
              key: API_KEY,
              resource: analyzeRequest,
            },
            (err, response) => {
              if (err) throw err;
              console.log("success")
              // console.log(JSON.stringify(response.data, null, 2));
              res.statusCode = 200
              res.send({ data: response.data })
            });
        })
        .catch(err => {
          throw err;
        });
      break;

    default:
      res.statusCode = 200
      res.json({ error: 'That wasnt a valid call' })
      break;
  }
}
