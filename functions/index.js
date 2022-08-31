// firebase emulators:start --only functions
// TODO: Inject token using axios middleware
// Add json object in .runtimeconfig.json to use env variables locally

const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');

admin.initializeApp({
  apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
  authDomain: 'gamebrary.com',
  databaseURL: 'https://gamebrary-8c736.firebaseio.com',
  projectId: 'gamebrary-8c736',
  storageBucket: 'gamebrary-8c736.appspot.com',
  messagingSenderId: '324529217902',
});

exports.steam = require('./steam');

exports.search = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  const { search, platform, token } = req.query;

  const missingFields = [search, token].filter(field => !field).length > 0;

  if (missingFields) {
    return res.status(400).json({ error: 'missing required params (search OR platform OR token)' });
  }

  const data = `
    search "${search}";
    fields id,name,slug,rating,release_dates.*,name,cover.image_id;
    limit 50;
    ${platform ? `where platforms = (${platform});` : ''}
  `;

  axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Client-ID': functions.config().twitch.clientid,
      Authorization: `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data); })
    .catch((error) => { res.send(error); });
});

// Twitch token gets refreshed once a week
exports.refreshToken = functions.pubsub.schedule('0 0 * * 0')
  .onRun((context) => {
    const id = functions.config().twitch.clientid;
    const secret = functions.config().twitch.clientsecret;
    const url = `https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`;

    axios({
      url,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(({ data }) => {
        const db = admin.firestore();

        return db.collection('app').doc('twitch').set(data, { merge: true })
          .then((res) => {
            return res.status(200).send(res);
          })
          .catch((e) => {
            return res.status(200).send(res);
          });
      })
      .catch(() => {});
  });

exports.platforms = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  const { token } = req.query;

  if (!token) {
    return res.status(400).send('missing token');
  }

  const data = `
    fields category,generation,name,alternative_name,slug;
    limit 200;
  `;

  axios({
    url: 'https://api.igdb.com/v4/platforms',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': functions.config().twitch.clientid,
      'Authorization': `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => {
      res.status(200).send(data)
    })
    .catch((error) => { res.send(error); });
});

exports.games = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { games, token } = req.query;

  if (!token) {
    return res.status(400).send('missing token');
  }

  if (!games) {
    return res.status(400).send('missing games');
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
      'Client-ID': functions.config().twitch.clientid,
      'Authorization': `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data) })
    .catch((error) => { res.send(error) });
});

exports.game = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*")

  const { gameId, token } = req.query;

  if (!token) {
    return res.status(400).send('missing token');
  }

  if (!gameId) {
    res.status(400).send('missing gameId');
  }

  const data = `fields
  age_ratings.*,
  alternative_names.*,
  bundles.*,
  collection.*,
  collection.games.*,
  cover.image_id,
  external_games.*,
  game_modes.name,
  genres.name,
  involved_companies.company.name,
  involved_companies.developer,
  involved_companies.publisher,
  name,
  platforms.id,
  platforms.name,
  player_perspectives.name,
  rating,
  release_dates.date,
  release_dates.platform,
  screenshots.image_id,
  similar_games,
  summary,
  slug,
  videos.video_id,
  websites.category,
  websites.url;

  where id = ${gameId};`;

  axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Client-ID': functions.config().twitch.clientid,
      Authorization: `Bearer ${token}`,
    },
    data,
  })
    .then(({ data }) => { res.status(200).send(data) })
    .catch((error) => { res.status(400).send(error) });
});

exports.igdb = functions.https.onRequest((req, res) => {
  // TODO: restrict to our domains
  res.set('Access-Control-Allow-Origin', '*');

  const { path, data, token } = req.query;

  if (!token) return res.status(400).send('missing token');
  if (!path) return res.status(400).send('missing path');
  if (!data) return res.status(400).send('missing data');

  axios({
    url: `https://api.igdb.com/v4/${path}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Client-ID': functions.config().twitch.clientid,
    },
    data,
  })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

exports.email = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', "*");

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

// https://gogapidocs.readthedocs.io/en/latest/listing.html
exports.gog = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  const { search } = req.query;
  if (!search) return res.status(400).send('Missing search param');

  axios({
    url: `https://embed.gog.com/games/ajax/filtered?mediaType=game&search=${search}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch(error => res.send(error));
});
