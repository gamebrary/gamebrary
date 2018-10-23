const functions = require('firebase-functions');
const axios = require('axios');

axios.defaults.headers.common['user-key'] = functions.config().igdb.key;

const igdbUrl = 'https://api-endpoint.igdb.com';

exports.search = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { searchText, platformId } = req.query;

    axios.get(`${igdbUrl}/games/?search=${searchText}&fields=*&filter[platforms][eq]=${platformId}&limit=20&order=popularity:desc`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.games = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { games, platformId } = req.query;

    axios.get(`${igdbUrl}/games/${games}/?fields=id,name,slug,created_at,updated_at,summary,rating,category,player_perspectives,release_dates,name,cover,platforms,screenshots,videos,websites,esrb,pegi,themes.name,game.name&expand=game,themes,developers,publishers,game_engines,game_modes,genres,platforms,player_perspectives`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.platform = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { platformId } = req.query;

    axios.get(`${igdbUrl}/platforms/${platformId}`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});
