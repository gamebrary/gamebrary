const functions = require('firebase-functions');
const axios = require('axios');

axios.defaults.headers.common['user-key'] = functions.config().igdbv3.key;

exports.search = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { search, platform } = req.query;

    const data = `search "${search}"; fields id,name,slug,rating,name,cover.image_id; where platforms = (${platform});`

    axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        data,
    })
        .then(({ data }) => { res.status(200).send(data) })
        .catch((error) => { res.send(error) });
});

exports.games = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { games } = req.query;

    if (!games) {
        res.status(400).send('missing param games');
    }

    const data = `fields
    id,
    name,
    slug,
    rating,
    name,
    cover.image_id;

    where id = (${ games });
    limit 500;`;

    axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        data,
    })
        .then(({ data }) => { res.status(200).send(data) })
        .catch((error) => { res.send(error) });
});

exports.game = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', "*")

    const { gameId } = req.query;

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

    axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        data,
    })
        .then(({ data }) => { res.status(200).send(data) })
        .catch((error) => { res.send(error) });
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
