import axios from 'axios';

const API_URL = process.env.API_URL;

export default {
    REGISTER({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/auth/register`, payload)
                .then(({ data }) => {
                    commit('SET_SESSION', data);
                    resolve(data);
                }).catch(reject);
        });
    },

    LOGIN({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/auth/login`, payload)
                .then(({ data }) => {
                    commit('SET_SESSION', data);
                    commit('SET_UPDATED_TIMESTAMP');
                    resolve(data);
                }).catch(reject);
        });
    },

    UPDATE_SETTINGS({ commit, state: { token } }, payload) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };

            axios.put(`${API_URL}/settings`, payload, options)
                .then(({ data: { settings } }) => {
                    commit('SET_SETTINGS', settings);
                    resolve();
                }).catch(reject);
        });
    },

    UPDATE_LISTS({ commit, state: { user, token } }) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };

            const payload = {
                lists: user.lists,
            };

            axios.put(`${API_URL}/lists`, payload, options)
                .then(() => {
                    commit('SET_UPDATED_TIMESTAMP');
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_LISTS({ commit, state: { token } }) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };

            axios.get(`${API_URL}/lists`, options)
                .then(({ data: { lists } }) => {
                    commit('UPDATE_LIST', lists);
                    commit('SET_UPDATED_TIMESTAMP');
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_USERS({ commit, state: { token } }) {
        commit('CLEAR_ADMIN_DATA');

        return new Promise((resolve, reject) => {
            const options = { headers: { token } };

            axios.get(`${API_URL}/users`, options)
                .then(({ data }) => {
                    commit('SET_ADMIN_DATA', data.reverse());
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_SHARE_LIST(context, listId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/share/${listId}`)
                .then(({ data: { lists } }) => {
                    resolve(lists);
                }).catch(reject);
        });
    },

    LOAD_SHARE_GAMES(context, gameList) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/games?games=${gameList.join(',')}`)
                .then(({ data }) => {
                    resolve(data);
                }).catch(reject);
        });
    },

    LOAD_GAMES({ commit, state: { token } }, gameList) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };
            axios.get(`${API_URL}/games?games=${gameList.join(',')}`, options)
                .then(({ data }) => {
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    SEARCH({ commit, state: { token } }, searchText) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };
            axios.get(`${API_URL}/search?searchText=${searchText}&order=popularity:desc`, options)
                .then(({ data }) => {
                    commit('SET_SEARCH_RESULTS', data);
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    DELETE_USER({ state: { token } }) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/user?token=${token}`)
                .then(() => {
                    resolve();
                }).catch(reject);
        });
    },
};
