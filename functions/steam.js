const functions = require('firebase-functions');
const axios = require('axios');
const BASE_URL =
// TODO: put base url in constant

exports.news = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")
  const { appId } = req.query;

  if (!appId) res.send(400);

  axios({
    url: `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch((error) => res.send(error));
});
