import axios from 'axios';

const FIREBASE_URL = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';

export default {
    LOAD_GAMES({ commit }, gameList) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/games?games=${gameList}`)
                .then(({ data }) => {
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_RELEASES({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get('https://api.github.com/repos/romancm/gamebrary/releases')
                .then(({ data }) => {
                    commit('SET_RELEASES', data);
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_PUBLIC_GAMES({ commit }, gameList) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/games?games=${gameList}`)
                .then(({ data }) => {
                    commit('SET_PUBLIC_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_GAME({ commit }, gameId) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/game?gameId=${gameId}`)
                .then(({ data }) => {
                    commit('SET_ACTIVE_GAME', data);
                    resolve();
                }).catch(reject);
        });
    },

    SEARCH({ commit, state }, searchText) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/search?searchText=${searchText}&platformId=${state.platform.id}`)
                .then(({ data }) => {
                    const originalData = data.slice();
                    if (state.platform.id === 37) {
                        // TODO: specify platform ids in platforms file,
                        // let endpoint handle multiple ids
                        axios.get(`${FIREBASE_URL}/search?searchText=${searchText}&platformId=137`)
                            .then((response) => {
                                const joinedData = [
                                    ...originalData,
                                    ...response.data,
                                ];

                                commit('SET_SEARCH_RESULTS', joinedData);
                                commit('CACHE_GAME_DATA', joinedData);
                                resolve();
                            }).catch(reject);
                    } else {
                        commit('SET_SEARCH_RESULTS', data);
                        commit('CACHE_GAME_DATA', data);
                        resolve();
                    }
                }).catch(reject);
        });
    },

    SEND_WELCOME_EMAIL(context, additionalUserInfo) {
        return new Promise((resolve, reject) => {
            if (additionalUserInfo && additionalUserInfo.profile) {
                axios.get(`${FIREBASE_URL}/email?address=${additionalUserInfo.profile.email}&template_id=welcome`)
                    .catch(reject);
            } else {
                reject();
            }
        });
    },
};
