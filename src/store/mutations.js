import moment from 'moment';
import Vue from 'vue';

export default {
    SET_USER(state, data) {
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

    CLEAR_SESSION(state) {
        state.user = null;
        state.platform = null;
        state.gameLists = null;
    },

    SET_SEARCH_RESULTS(state, results) {
        state.results = results;
    },

    SET_AUTHORIZING_STATUS(state, status) {
        state.authorizing = status;
    },

    CLEAR_SEARCH_RESULTS(state) {
        state.results = [];
    },

    SET_ACTIVE_GAME(state, game) {
        state.game = state.games[game];
    },

    SET_EDIT_GAME(state, { listId, gameId }) {
        state.editGame = gameId;
        state.activeList = listId;
    },

    SET_ACTIVE_LIST(state, listIndex) {
        state.activeList = listIndex;
    },

    SET_ADMIN_DATA(state, data) {
        state.adminData = data;
    },

    CLEAR_ADMIN_DATA(state) {
        state.adminData = null;
    },

    SET_PLATFORM(state, platform) {
        state.platform = platform;
    },

    CLEAR_ACTIVE_GAME(state) {
        state.game = null;
    },

    SORT_LIST(state, listIndex) {
        const games = state.gameLists[state.platform.code][listIndex].games;

        games.sort((a, b) => {
            const gameA = state.games[a].name.toUpperCase();
            const gameB = state.games[b].name.toUpperCase();

            if (gameA < gameB) {
                return -1;
            }

            return gameA > gameB ? 1 : 0;
        });
    },

    UPDATE_LIST_NAME(state, { listIndex, listName }) {
        state.gameLists[state.platform.code][listIndex].name = listName;
    },

    SET_SETTINGS(state, settings) {
        state.settings = settings;
    },

    REMOVE_LIST(state, index) {
        state.gameLists[state.platform.code].splice(index, 1);
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
            state.games[game.id] = { ...game };
        });
    },
};
