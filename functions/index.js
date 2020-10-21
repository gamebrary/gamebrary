const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
  apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
  authDomain: 'gamebrary.com',
  databaseURL: 'https://gamebrary-8c736.firebaseio.com',
  projectId: 'gamebrary-8c736',
  storageBucket: 'gamebrary-8c736.appspot.com',
  messagingSenderId: '324529217902',
});

const axios = require('axios');

// firebase emulators:start --only functions
// Add json object in .runtimeconfig.json to use env variables locally

exports.search = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { search, platform, token } = req.query;

  if (!search) {
    return res.status(400).send('missing param search');
  }

  if (!platform) {
    return res.status(400).send('missing param games');
  }

  if (!token) {
    return res.status(400).send('missing param games');
  }

  const data = `
  search "${search}";
  fields id,name,slug,rating,release_dates.*,name,cover.image_id;
  limit 50;
  where platforms = (${platform});`

  axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '0oo6dw5f0y8frai8l31koyq8egcu17',
      'Authorization': `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data) })
    .catch((error) => { res.send(error) });
});

// TODO: update to run once a month instead of once a week
exports.refreshToken = functions.pubsub.schedule('0 0 * * 0')
  .onRun((context) => {
    const id = functions.config().twitch.clientid;
    const secret = functions.config().twitch.clientsecret;
    const url = `https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`;

    axios({
      url,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(({ data }) => {
        const db = admin.firestore();

        return db.collection('app').doc('twitch').set(data, { merge: true })
          .then((res) => {
            console.log('token refreshed');
            return res.status(200).send(res);
          })
          .catch((e) => {
            return res.status(200).send(res);
          });
      })
      .catch(() => {});
  });

exports.platforms = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { token } = req.query;

  console.log(token);

  if (!token) {
    return res.status(400).send('missing param games');
  }

  const data = `
    fields category,generation,name,alternative_name,slug;
    limit 200;
  `

  axios({
    url: 'https://api.igdb.com/v4/platforms',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '0oo6dw5f0y8frai8l31koyq8egcu17',
      'Authorization': `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => {
      res.status(200).send(data)
    })
    .catch((error) => { res.send(error) });
});

exports.games = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { games, token } = req.query;

  if (!token) {
    return res.status(400).send('missing token');
  }

  if (!games) {
    return res.status(400).send('missing param games');
  }

  const data = `fields
  id,
  name,
  slug,
  rating,
  release_dates.*,
  name,
  cover.image_id;

  where id = (${ games });
  limit 500;`;

  axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '0oo6dw5f0y8frai8l31koyq8egcu17',
      'Authorization': `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data) })
    .catch((error) => { res.send(error) });
});

// TODO: fix game
exports.game = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { gameId, token } = req.query;

  if (!token) {
    return res.status(400).send('missing token');
  }

  if (!gameId) {
    res.status(400).send('missing param gameId');
  }

  const data = `fields
  name,
  summary,
  cover.image_id,
  screenshots.image_id,
  player_perspectives.name,
  involved_companies.company.name,
  involved_companies.developer,
  involved_companies.publisher,
  release_dates.platform,
  release_dates.date,
  websites.category,
  websites.url,
  age_ratings.*,
  videos.video_id,
  rating,
  genres.name,
  platforms.name,
  platforms.id,
  game_modes.name,
  time_to_beat;

  where id = ${ gameId };`;

  console.log(data);

  axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '0oo6dw5f0y8frai8l31koyq8egcu17',
      'Authorization': `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data) })
    .catch((error) => { res.status(400).send(error) });
});

exports.email = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { template_id, address } = req.query;

  if (!template_id || !address) {
    res.send(400);
  }

  const data = {
    recipients: [
      { address },
    ],
    content: { template_id },
  };

  axios({
    url: 'https://api.sparkpost.com/api/v1/transmissions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': functions.config().sparkpost.key,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data) })
    .catch((error) => { res.send(error) });
});
