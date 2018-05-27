export default {
    SET_SESSION(state, { user, token }) {
        state.token = token;
        state.user = user;
    },

    SET_SEARCH_RESULTS(state, results) {
        state.results = results;
    },

    UPDATE_USER(state, user) {
        state.user = user;
    },

    UPDATE_LIST(state, lists) {
        state.user.lists = lists;
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
            if (!state.games[game.id]) {
                state.games = { ...state.games, [game.id]: game };
            }
        });
    },

    CLEAR_SESSION(state) {
        state.token = null;
        state.user = null;
    },
};
