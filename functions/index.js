const functions = require('firebase-functions');
const axios = require('axios');

axios.defaults.headers.common['user-key'] = functions.config().igdb.key;

const igdbUrl = 'https://api-endpoint.igdb.com';
const igdbV3Url = 'https://api-v3.igdb.com/search/';
const igdbFields = 'id,name,slug,created_at,updated_at,summary,rating,category,player_perspectives,release_dates,name,cover,platforms,screenshots,videos,websites,esrb,pegi,themes.name,game.name&expand=game,themes,developers,publishers,game_engines,game_modes,genres,platforms,player_perspectives';
const igdbV3Fields = 'fields alternative_name,character,collection,company,description,game,name,person,platform,popularity,published_at,test_dummy,theme;';
const igdbFieldsMinimal = 'id,name,slug,rating,name,cover';

exports.search = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { searchText, platformId } = req.query;

    axios.get(`${igdbUrl}/games/?search=${searchText}&fields=${igdbFields}&filter[platforms][eq]=${platformId}&limit=20&order=popularity:desc`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});

exports.games = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { games, platformId } = req.query;

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

exports.platform = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { platformId } = req.query;

    axios.get(`${igdbUrl}/platforms/${platformId}`)
        .then(({ data }) => { res.status(200).send(data) })
        .catch(() => { res.send(400) });
});
//
// // IGDB V3
// exports.searchV3 = functions.https.onRequest((req, res) => {
//     res.set('Access-Control-Allow-Origin', "*")
//
//     const { searchText, platform } = req.query;
//
//     const data = `
//     search "${searchText}";
//     fields game.*;
//     where game != null;
//     `;
//
//     console.log(data);
//
//     axios({
//         url: igdbV3Url,
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'user-key': '3b516a46c3af209bb6e287e9090d720c'
//         },
//         data,
//     })
//         .then(({ data }) => { res.status(200).send(data) })
//         .catch(() => { res.send(400) });
//     // res.send(req.body)
//     // axios.get(`${igdbV3Url}/games/?search=${searchText}&fields=${igdbFields}&filter[platforms][eq]=${platformId}&limit=20&order=popularity:desc`)
//     //     .then(({ data }) => { res.status(200).send(data) })
//     //     .catch(() => { res.send(400) });
// });
