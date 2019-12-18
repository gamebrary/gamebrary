import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/firestore';

const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
// const API_BASE = 'http://localhost:5000/gamebrary-8c736/us-central1';

export default {
  LOAD_GAMES({ commit }, gameList) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/games?games=${gameList}`)
        .then(({ data }) => {
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  SAVE_LIST({ commit, state }, payload) {
    const db = firebase.firestore();

    db.collection('lists').doc(state.user.uid).set(payload, { merge: true })
      .then(() => {
        commit('SAVE_LISTS', payload);
      });
  },

  SAVE_PROGRESSES({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('progresses').doc(state.user.uid).set(state.progresses, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_PROGRESSES_NO_MERGE({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('progresses').doc(state.user.uid).set(state.progresses, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_TAGS({ state }, tags) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('tags').doc(state.user.uid).set(tags, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_TAGS_NO_MERGE({ state }, tags) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('tags').doc(state.user.uid).set(tags, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_LIST_NO_MERGE({ commit, state }, payload) {
    const db = firebase.firestore();

    db.collection('lists').doc(state.user.uid).set(payload, { merge: false })
      .then(() => {
        commit('SAVE_LISTS', payload);
      });
  },

  SAVE_SETTINGS({ commit, state }, settings) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('settings').doc(state.user.uid).set(settings, { merge: true })
        .then(() => {
          commit('SET_SETTINGS', settings);
          resolve();
        })
        .catch(reject);
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
      axios.get(`${API_BASE}/games?games=${gameList}`)
        .then(({ data }) => {
          commit('SET_PUBLIC_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  LOAD_GAME({ commit }, gameId) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/game?gameId=${gameId}`)
        .then(({ data }) => {
          commit('SET_ACTIVE_GAME', data);
          resolve();
        }).catch(reject);
    });
  },

  SEARCH({ commit, state }, searchText) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/search?search=${searchText}&platform=${state.platform.id}`)
        .then(({ data }) => {
          commit('SET_SEARCH_RESULTS', data);
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  SEND_WELCOME_EMAIL(context, additionalUserInfo) {
    return new Promise((resolve, reject) => {
      if (additionalUserInfo && additionalUserInfo.profile) {
        axios.get(`${API_BASE}/email?address=${additionalUserInfo.profile.email}&template_id=welcome`)
          .catch(reject);
      } else {
        reject();
      }
    });
  },
};
