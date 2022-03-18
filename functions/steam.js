const functions = require('firebase-functions');
const axios = require('axios');

const STEAM_BASE_URL = 'https://api.steampowered.com';

exports.game = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  const { gameId } = req.query;

  if (!gameId) res.status(400).send('Missing steam gameId');

  axios({
    url: `https://store.steampowered.com/api/appdetails?appids=${gameId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch(error => res.send(error));
});

exports.news = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { appId } = req.query;

  if (!appId) res.send(400);

  axios({
    url: `${STEAM_BASE_URL}/ISteamNews/GetNewsForApp/v0002/?appid=${appId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch(error => res.send(error));
});

exports.friends = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { appId } = req.query;

  if (!appId) res.send(400);

  axios({
    url: `${STEAM_BASE_URL}/ISteamUser/GetFriendList/v1?key=0DFD0511A922896D8064A4EABC32BE08&steamid=76561198017003200`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch(error => res.send(error));
});

exports.ownedGames = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { appId } = req.query;

  if (!appId) res.send(400);

  axios({
    url: `${STEAM_BASE_URL}/IPlayerService/GetOwnedGames/v0001/?key=0DFD0511A922896D8064A4EABC32BE08&steamid=76561198017003200&include_appinfo=true&format=json`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch(error => res.send(error));
});

exports.gameList = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { appId } = req.query;

  if (!appId) res.send(400);

  axios({
    url: `${STEAM_BASE_URL}/ISteamApps/GetAppList/v2`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })
    .then(({ data }) => res.status(200).send(data))
    .catch(error => res.send(error));
});
