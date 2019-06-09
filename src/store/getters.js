export default {
    // eslint-disable-next-line
    ageRatings: () => {
        return {
            1: '3',
            2: '7',
            3: '12',
            4: '16',
            5: '18',
            6: 'RP',
            7: 'EC',
            8: 'E',
            9: 'E10',
            10: 'T',
            11: 'M',
            12: 'AO',
        };
    },

    releaseDate: (state) => {
        // eslint-disable-next-line
        const releaseDate = state.game.release_dates.filter(({ platform }) => state.platform.id === platform);

        return releaseDate && releaseDate.length
            ? releaseDate[0].date
            : null;
    },

    developers: (state) => {
        const developers = state.game.involved_companies.filter(({ developer }) => developer);

        return developers
            ? developers.map(publisher => publisher.company.name).join(', ')
            : null;
    },

    publishers: (state) => {
        const publishers = state.game.involved_companies.filter(({ publisher }) => publisher);

        return publishers
            ? publishers.map(publisher => publisher.company.name).join(', ')
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

    gamePlatforms: (state) => {
        const gamePlatforms = state.game.platforms;

        return gamePlatforms
            ? gamePlatforms.map(gamePlatform => gamePlatform.name).join(', ')
            : null;
    },

    // eslint-disable-next-line
    activeList: ({ gameLists, platform, activeListIndex }) => gameLists[platform.code][activeListIndex],

    darkModeEnabled: state => state.settings && state.settings.nightMode,
};
