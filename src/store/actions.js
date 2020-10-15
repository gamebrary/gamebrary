import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
// const API_BASE = 'http://localhost:5001/gamebrary-8c736/us-central1';

export default {
  //
  // NEW STUFF
  //

  LOAD_IGDB_PLATFORMS({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/platforms`)
        .then(({ data }) => {
          commit('SET_PLATFORMS', data);
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_POPULAR_GAMES() {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/popularGames`)
        .then(({ data }) => {
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_BOARDS({ state, commit }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('boards').where('owner', '==', state.user.uid)
        .get()
        .then(({ docs }) => {
          const boards = docs.length
            ? docs.map((doc) => {
              const board = doc.data();

              return {
                id: doc.id,
                ...board,
              };
            })
            : null;

          if (boards) {
            commit('SET_BOARDS', boards);
          }

          resolve();
        })
        .catch(reject);
    });
  },

  LOAD_BOARD({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('boards')
        .doc(id)
        .get()
        .then((doc) => {
          const board = doc.data();

          if (state.user.uid !== board.owner) {
            return reject();
          }

          commit('SET_BOARD', {
            ...board,
            id: doc.id,
          });
          return resolve();
        })
        .catch(reject);
    });
  },

  LOAD_PUBIC_BOARD({ commit }, id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('boards')
        .doc(id)
        .get()
        .then((doc) => {
          const board = doc.data();

          commit('SET_BOARD', {
            ...board,
            id: doc.id,
          });

          return resolve();
        })
        .catch(reject);
    });
  },

  CREATE_BOARD({ state, commit }, board) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      const payload = {
        ...board,
        owner: state.user.uid,
      };

      db.collection('boards').add(payload)
        .then(({ id }) => {
          commit('ADD_BOARD', {
            ...payload,
            id,
          });

          resolve();
        })
        .catch(reject);
    });
  },


  DELETE_WALLPAPER({ commit }, { fullPath }) {
    return new Promise((resolve, reject) => {
      firebase.storage().ref(fullPath).delete()
        .then(() => {
          commit('REMOVE_WALLPAPER', fullPath);
          resolve();
        })
        .catch(reject);
    });
  },

  LOAD_WALLPAPER(context, path) {
    const storage = firebase.storage().ref();

    return new Promise((resolve, reject) => {
      storage.child(path).getDownloadURL()
        .then((url) => {
          resolve(url);
        })
        .catch(reject);
    });
  },

  LOAD_WALLPAPERS({ state, commit }) {
    const storage = firebase.storage().ref(`${state.user.uid}/wallpapers`);

    return new Promise((resolve, reject) => {
      storage
        .listAll()
        .then(({ items }) => {
          const wallpapers = items.map(({ fullPath, name }) => {
            const wallpaper = {
              fullPath,
              name,
            };

            return wallpaper;
          });

          // TODO: refactor? there's gotta be a better way to do this
          const fetchedUrls = [];

          wallpapers.forEach(({ fullPath }, index) => {
            firebase.storage()
              .ref()
              .child(fullPath).getDownloadURL()
              .then((url) => {
                fetchedUrls.push(url);

                wallpapers[index].url = url;

                if (fetchedUrls.length === wallpapers.length) {
                  commit('SET_WALLPAPERS', wallpapers);
                  resolve();
                }
              })
              .catch(reject);
          });
        })
        .catch(reject);
    });
  },

  UPLOAD_WALLPAPER({ state, commit }, file) {
    return new Promise((resolve, reject) => {
      firebase.storage()
        .ref(`${state.user.uid}/wallpapers/${file.name}`)
        .put(file)
        .then((response) => {
          if (response.state === 'success') {
            const { metadata: { fullPath, name } } = response;

            firebase.storage()
              .ref()
              .child(fullPath).getDownloadURL()
              .then((url) => {
                const wallpaper = {
                  fullPath,
                  name,
                  url,
                };

                commit('ADD_WALLPAPER', wallpaper);
                resolve();
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  },

  // set merge to true when deleting lists
  SAVE_BOARD({ state }, merge = false) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('boards')
        .doc(state.board.id)
        .set(state.board, { merge })
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  },

  DELETE_BOARD({ commit }, id) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('boards').doc(id).delete()
        .then(() => {
          commit('REMOVE_BOARD', id);
          resolve();
        })
        .catch(reject);
    });
  },

  LOAD_BOARD_GAMES({ commit }, gameList) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/games?games=${gameList}`)
        .then(({ data }) => {
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  SEARCH_GAMES({ commit, state }, searchText) {
    const platforms = state.board.platforms.join(',');

    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/search?search=${searchText}&platform=${platforms}`)
        .then(({ data }) => {
          commit('SET_SEARCH_RESULTS', data);
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
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

  GET_TWITCH_TOKEN({ state, commit }, data) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('app')
        .doc('twitch')
        .get()
        .then((doc) => {
          commit('SET_TWITCH_TOKEN', doc.data());
        })
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

  // TODO: combine into single action
  SAVE_NOTES({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('notes').doc(state.user.uid).set(state.notes, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_NOTES_NO_MERGE({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('notes').doc(state.user.uid).set(state.notes, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  // TODO: combine into single action
  SAVE_PROGRESSES_NO_MERGE({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('progresses').doc(state.user.uid).set(state.progresses, { merge: false })
        .then(() => resolve())
        .catch(reject);
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

  // TODO: use firebase email extension instead
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

  LOAD_RELEASES({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('https://api.github.com/repos/romancm/gamebrary/releases')
        .then(({ data }) => {
          commit('SET_RELEASES', data);
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_GITHUB_REPOSITORY() {
    return new Promise((resolve, reject) => {
      axios.get('https://api.github.com/repos/romancm/gamebrary')
        .then(({ data }) => {
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_GITHUB_README() {
    return new Promise((resolve, reject) => {
      axios.get('https://raw.githubusercontent.com/romancm/gamebrary/master/README.md')
        .then(({ data }) => {
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_GAME(context, gameId) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/game?gameId=${gameId}`)
        .then(({ data }) => {
          const [game] = data;

          resolve(game);
        }).catch(reject);
    });
  },
};
