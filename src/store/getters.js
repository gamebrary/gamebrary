import moment from 'moment';

export default {
    auth: state => Boolean(state.token && state.user),
    developers: (state) => {
        const developers = state.game.developers;

        return developers
            ? developers.map(developer => developer.name).join(', ')
            : null;
    },

    publishers: (state) => {
        const publishers = state.game.publishers;

        return publishers
            ? publishers.map(publisher => publisher.name).join(', ')
            : null;
    },

    genres: (state) => {
        const genres = state.game.genres;

        return genres
            ? genres.map(genre => genre.name).join(', ')
            : null;
    },

    playerPerspectives: (state) => {
        const perspectives = state.game.player_perspectives;

        return perspectives
            ? perspectives.map(perspective => perspective.name).join(', ')
            : null;
    },

    gameModes: (state) => {
        const gameModes = state.game.game_modes;

        return gameModes
            ? gameModes.map(gameMode => gameMode.name).join(', ')
            : null;
    },

    gameRating: state => parseInt(state.game.rating, 10),
    releaseDate: state => moment(new Date(state.game.release_dates.find(r => r.platform === state.platforms.nsw)).human).format('LL'),
};
