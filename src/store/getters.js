import platforms from '@/platforms';

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
        const releaseDate = state.game && state.game.release_dates
            ? state.game.release_dates.filter(({ platform }) => state.platform.id === platform)
            : null;

        return releaseDate && releaseDate.length
            ? releaseDate[0].date
            : null;
    },

    developers: (state) => {
        const developers = state.game && state.game.involved_companies
            ? state.game.involved_companies.filter(({ developer }) => developer)
            : null;

        return developers
            ? developers.map(publisher => publisher.company.name).join(', ')
            : null;
    },

    publishers: (state) => {
        const publishers = state.game && state.game.involved_companies
            ? state.game.involved_companies.filter(({ publisher }) => publisher)
            : null;

        return publishers
            ? publishers.map(publisher => publisher.company.name).join(', ')
            : null;
    },

    genres: (state) => {
        const genres = state.game && state.game.genres
            ? state.game.genres
            : null;

        return genres
            ? genres.map(genre => genre.name).join(', ')
            : null;
    },

    playerPerspectives: (state) => {
        const perspectives = state.game && state.game.player_perspectives
            ? state.game.player_perspectives
            : null;

        return perspectives
            ? perspectives.map(perspective => perspective.name).join(', ')
            : null;
    },

    gameModes: (state) => {
        const gameModes = state.game && state.game.game_modes
            ? state.game.game_modes
            : null;

        return gameModes
            ? gameModes.map(gameMode => gameMode.name).join(', ')
            : null;
    },

    gamePlatforms: (state) => {
        const gamePlatforms = state.game && state.game.platforms
            ? state.game.platforms.map(platform => platform.id)
            : null;

        return platforms.filter(({ id }) => id !== state.platform.id && gamePlatforms.includes(id));
    },

    // eslint-disable-next-line
    activeList: ({ gameLists, platform, activeListIndex }) => gameLists[platform.code][activeListIndex],

    brandingEnabled: ({ settings, platform }) => {
        const brandingEnabled = settings && settings.branding;
        const brandingAvailble = platform && platform.brandingEnabled && Boolean(platform.hex);

        return Boolean(brandingEnabled && brandingAvailble);
    },
};
