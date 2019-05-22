import Vue from 'vue';

export default {
    SET_USER(state, data) {
        state.isTouchDevice = ('ontouchstart' in window);

        state.user = {
            uid: data.uid,
            displayName: data.displayName,
            email: data.email,
            emailVerified: data.emailVerified,
            dateJoined: data.metadata.creationTime,
            photoURL: data.photoURL,
        };
    },

    SET_GAME_LISTS(state, lists) {
        state.gameLists = lists;
    },

    SET_WALLPAPER_URL(state, url) {
        state.wallpaperUrl = url;
    },

    SET_RELEASES(state, releases) {
        state.releases = releases;
    },

    SET_TAGS(state, tags) {
        state.tags = tags;
    },

    SET_NOTES(state, notes) {
        state.notes = notes;
    },

    ADD_GAME_TAG(state, { tagName, gameId }) {
        state.tags[tagName].games.push(gameId);
    },

    REMOVE_GAME_TAG(state, { tagName, gameId }) {
        state.tags[tagName].games.splice(state.tags[tagName].games.indexOf(gameId), 1);
    },

    CLEAR_SESSION(state) {
        state.user = null;
        state.activeListIndex = null;
        state.gameLists = {};
        state.settings = null;
        state.platform = null;
        state.results = null;
        state.games = {};
        state.publicGameData = {};
        state.game = null;
    },

    SET_SEARCH_RESULTS(state, results) {
        state.results = results;
    },

    CLEAR_SEARCH_RESULTS(state) {
        state.results = [];
    },

    SET_ACTIVE_GAME(state, [game]) {
        state.game = game;
    },

    CLEAR_ACTIVE_GAME(state) {
        state.game = null;
    },

    SET_EDIT_GAME(state, { listId, gameId }) {
        state.editGame = gameId;
        state.activeListIndex = listId;
    },

    SET_SEARCH_ACTIVE(state, status) {
        state.searchActive = status;
    },

    SET_ADDING_LIST_STATUS(state, status) {
        state.addingList = status;
    },

    SET_ACTIVE_LIST_INDEX(state, listIndex) {
        state.activeListIndex = listIndex;
    },

    CLEAR_ACTIVE_LIST_INDEX(state) {
        state.activeListIndex = null;
        state.searchActive = null;
        state.addingList = false;
    },

    SET_PLATFORM(state, platform) {
        state.platform = platform;
    },

    SORT_LIST_ALPHABETICALLY(state, listIndex) {
        const games = state.gameLists[state.platform.code][listIndex].games;

        games.sort((a, b) => {
            const gameA = state.games[a] && state.games[a].name
                ? state.games[a].name.toUpperCase()
                : '';

            const gameB = state.games[b] && state.games[b].name
                ? state.games[b].name.toUpperCase()
                : '';

            if (gameA < gameB) {
                return -1;
            }

            return gameA > gameB ? 1 : 0;
        });
    },

    SORT_LIST_BY_RATING(state, listIndex) {
        const games = state.gameLists[state.platform.code][listIndex].games;

        games.sort((a, b) => {
            const gameA = state.games[a] && state.games[a].rating
                ? state.games[a].rating
                : 0;

            const gameB = state.games[b] && state.games[b].rating
                ? state.games[b].rating
                : 0;

            if (gameA > gameB) {
                return -1;
            }

            return gameA < gameB ? 1 : 0;
        });
    },

    UPDATE_LIST_NAME(state, { listIndex, listName }) {
        state.gameLists[state.platform.code][listIndex].name = listName;
    },

    UPDATE_LIST_VIEW(state, { listIndex, view }) {
        state.gameLists[state.platform.code][listIndex].view = view;
    },

    UPDATE_LIST_SORT(state, { listIndex, sortOrder }) {
        state.gameLists[state.platform.code][listIndex].sortOrder = sortOrder;
    },

    UPDATE_LIST_COVERS_SIZE(state, { listIndex, size }) {
        state.gameLists[state.platform.code][listIndex].coversSize = size;
    },

    SET_SETTINGS(state, settings) {
        state.settings = settings;
    },

    MOVE_LIST(state, { from, to }) {
        const cutOut = state.gameLists[state.platform.code].splice(from, 1)[0];
        state.gameLists[state.platform.code].splice(to, 0, cutOut);
    },

    REMOVE_LIST(state, index) {
        state.gameLists[state.platform.code].splice(index, 1);
    },

    REMOVE_PLATFORM(state) {
        Vue.delete(state.gameLists, state.platform.code);
    },

    ADD_GAME(state, { gameId, listId }) {
        const currentList = state.gameLists[state.platform.code][listId];

        currentList.games.push(gameId);
    },

    ADD_LIST(state, listName) {
        const newList = {
            games: [],
            name: listName,
        };

        if (!state.gameLists[state.platform.code]) {
            Vue.set(state.gameLists, state.platform.code, []);
        }

        state.gameLists[state.platform.code].push(newList);
    },

    REMOVE_GAME(state, { gameId, listId }) {
        const currentList = state.gameLists[state.platform.code][listId];

        currentList.games.splice(currentList.games.indexOf(gameId), 1);
    },

    CACHE_GAME_DATA(state, data) {
        data.forEach((game) => {
            Vue.set(state.games, game.id, { ...game });
        });
    },

    SET_PUBLIC_GAME_DATA(state, data) {
        data.forEach((game) => {
            Vue.set(state.publicGameData, game.id, { ...game });
        });
    },
};
