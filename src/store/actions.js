import axios from 'axios';

const FIREBASE_URL = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';

export default {
    LOAD_GAMES({ commit }, gameList) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/games?games=${gameList.join(',')}`)
                .then(({ data }) => {
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    SEARCH({ commit }, searchText) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/search?searchText=${searchText}&platformId=130`)
                .then(({ data }) => {
                    commit('SET_SEARCH_RESULTS', data);
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },
};
