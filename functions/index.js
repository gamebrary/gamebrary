const functions = require('firebase-functions');
const axios = require('axios');

axios.defaults.headers.common['user-key'] = functions.config().igdb.key;

const igdbUrl = 'https://api-endpoint.igdb.com';
const igdbV3Url = 'https://api-v3.igdb.com/';
const igdbFields = 'id,name,slug,created_at,updated_at,summary,rating,category,player_perspectives,release_dates,name,cover,platforms,screenshots,videos,websites,esrb,pegi,themes.name,game.name&expand=game,themes,developers,publishers,game_engines,game_modes,genres,platforms,player_perspectives';
const igdbV3Fields = 'fields alternative_name,character,collection,company,description,game,name,person,platform,popularity,published_at,test_dummy,theme;';
const igdbFieldsMinimal = 'id,name,slug,rating,name,cover,release_dates';

exports.search = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { searchText, platformId } = req.query;

    axios.get(`${igdbUrl}/games/?search=${searchText}&fields=${igdbFields}&filter[platforms][eq]=${platformId}&limit=20&order=popularity:desc`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.games = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { games } = req.query;

    axios.get(`${igdbUrl}/games/${games}/?fields=${igdbFieldsMinimal}`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.game = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { gameId } = req.query;

    axios.get(`${igdbUrl}/games/${gameId}/?fields=${igdbFields}`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
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
        .catch(() => { res.send(400) });
});

exports.searchV2 = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { search, platform } = req.query;

    const data = `search "${search}"; fields id,name,slug,rating,name,cover.url; where platforms = (${platform});`

    axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': '3b516a46c3af209bb6e287e9090d720c'
        },
        data,
    })
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.gameV2 = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { gameId } = req.query;

    if (!gameId) {
        res.status(400).send('missing param gameId');
    }

    const data = `fields *; where id = ${ gameId };`;

    axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': '3b516a46c3af209bb6e287e9090d720c'
        },
        data,
    })
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.gamesV2 = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { gameId } = req.query;

    if (!gameId) {
        res.status(400).send('missing param gameId');
    }

    const data = `fields id,name,slug,rating,name,cover.url; where id = (${ gameId });`;

    axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': '3b516a46c3af209bb6e287e9090d720c'
        },
        data,
    })
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});


// TODO: merge search and game, swap out or request fields in FE