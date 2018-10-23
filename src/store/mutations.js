import moment from 'moment';

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

    UPDATE_USER(state, user) {
        state.user = user;
    },

    UPDATE_LIST(state, lists) {
        state.user.lists = lists;
    },

    SORT_LIST(state, listIndex) {
        const games = state.user.lists[listIndex].games;

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
        state.user.lists[listIndex].name = listName;
    },

    SET_UPDATED_TIMESTAMP(state) {
        state.dataUpdatedTimestamp = moment().format();
    },

    SET_SETTINGS(state, settings) {
        state.settings = settings;
    },

    REMOVE_LIST(state, index) {
        state.user.lists.splice(index, 1);
    },

    ADD_GAME(state, { gameId, listId }) {
        state.user.lists[listId].games.push(gameId);
    },

    ADD_LIST(state, listName) {
        const newList = {
            games: [],
            name: listName,
        };

        state.user.lists.push(newList);
    },

    REMOVE_GAME(state, { gameId, listId }) {
        state.user.lists[listId].games.splice(state.user.lists[listId].games.indexOf(gameId), 1);
    },

    CACHE_GAME_DATA(state, data) {
        data.forEach((game) => {
            state.games[game.id] = { ...game };
        });
    },
};
