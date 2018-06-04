import axios from 'axios';

// const ENDPOINT = 'http://localhost:3333';
const ENDPOINT = 'https://switchlist-api.herokuapp.com';

export default {
    REGISTER({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`${ENDPOINT}/auth/register`, payload)
                .then(({ data }) => {
                    commit('SET_SESSION', data);
                    resolve(data);
                }).catch(reject);
        });
    },

    LOGIN({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`${ENDPOINT}/auth/login`, payload)
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

            axios.put(`${ENDPOINT}/settings`, payload, options)
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

            axios.put(`${ENDPOINT}/lists`, payload, options)
                .then(() => {
                    commit('SET_UPDATED_TIMESTAMP');
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_LISTS({ commit, state: { token } }) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };

            axios.get(`${ENDPOINT}/lists`, options)
                .then(({ data: { lists } }) => {
                    commit('UPDATE_LIST', lists);
                    commit('SET_UPDATED_TIMESTAMP');
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_GAMES({ commit, state: { token } }, gameList) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };
            axios.get(`${ENDPOINT}/games?games=${gameList.join(',')}`, options)
                .then(({ data }) => {
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    SEARCH({ commit, state: { token } }, searchText) {
        return new Promise((resolve, reject) => {
            const options = { headers: { token } };
            axios.get(`${ENDPOINT}/search?searchText=${searchText}`, options)
                .then(({ data }) => {
                    commit('SET_SEARCH_RESULTS', data);
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },
};
