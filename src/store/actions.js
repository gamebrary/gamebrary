import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
// const API_BASE = 'http://localhost:5001/gamebrary-8c736/us-central1';

export default {
  LOAD_IGDB_PLATFORMS({ state, commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/platforms?token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          commit('SET_PLATFORMS', data);
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_WIKIPEDIA_ARTICLE(context, articleTitle) {
    return new Promise((resolve, reject) => {
      axios.get(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&titles=${articleTitle}&format=json`)
        .then(({ data: { query } }) => {
          const pageIds = Object.keys(query.pages);

          const article = pageIds.length
            ? query.pages[pageIds[0]]
            : null;

          resolve(article);
        }).catch(reject);
    });
  },

  LOAD_BOARDS({ state, commit }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('boards')
        .where('owner', '==', state.user.uid)
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

          commit('SET_ACTIVE_BOARD', {
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

          commit('SET_ACTIVE_BOARD', {
            ...board,
            id: doc.id,
          });

          return resolve();
        })
        .catch(reject);
    });
  },

  LOAD_PUBIC_BOARDS({ commit }) {
    // TODO: paginate
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('boards')
        .where('isPublic', '==', true)
        .get()
        .then((querySnapshot) => {
          const boards = querySnapshot.docs.map(doc => doc.data());

          commit('SET_PUBLIC_BOARDS', boards);

          return resolve(boards);
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

      db.collection('boards')
        .add(payload)
        .then(({ id }) => {
          const newBoard = {
            ...payload,
            id,
          };

          commit('ADD_BOARD', newBoard);

          resolve(newBoard);
        })
        .catch(reject);
    });
  },


  DELETE_WALLPAPER({ commit }, { fullPath }) {
    return new Promise((resolve, reject) => {
      firebase.storage()
        .ref(fullPath)
        .delete()
        .then(() => {
          commit('REMOVE_WALLPAPER', fullPath);
          resolve();
        })
        .catch(reject);
    });
  },

  LOAD_WALLPAPER(context, path) {
    return new Promise((resolve, reject) => {
      firebase.storage()
        .ref()
        .child(path)
        .getDownloadURL()
        .then((url) => {
          resolve(url);
        })
        .catch(reject);
    });
  },

  LOAD_WALLPAPERS({ state, commit }) {
    return new Promise((resolve, reject) => {
      firebase.storage()
        .ref(`${state.user.uid}/wallpapers`)
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
          // TODO: for real, refactor this crap, use promise.all or something better
          const fetchedUrls = [];

          wallpapers.forEach(({ fullPath }, index) => {
            firebase.storage()
              .ref()
              .child(fullPath)
              .getDownloadURL()
              .then((url) => {
                fetchedUrls.push(url);

                wallpapers[index].url = url;

                if (fetchedUrls.length === wallpapers.length) {
                  const fetchedMetadatas = [];

                  wallpapers.forEach((wallpaper, i) => {
                    firebase.storage()
                      .ref(wallpaper.fullPath)
                      .getMetadata()
                      .then((metadata) => {
                        fetchedMetadatas.push(metadata);

                        wallpapers[i].metadata = metadata;

                        if (fetchedMetadatas.length === wallpapers.length) {
                          commit('SET_WALLPAPERS', wallpapers);
                          resolve();
                        }
                      });
                  });
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
              .child(fullPath)
              .getDownloadURL()
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

      db.collection('boards')
        .doc(id)
        .delete()
        .then(() => {
          commit('REMOVE_BOARD', id);
          resolve();
        })
        .catch(reject);
    });
  },

  LOAD_GAMES({ state, commit }, gameList) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/games?games=${gameList}&token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  SEARCH_BOARD_GAMES({ commit, state }, searchText) {
    const platforms = state.board.platforms.join(',');

    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/search?search=${searchText}&platform=${platforms}&token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          commit('SET_SEARCH_RESULTS', data);
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  CUSTOM_SEARCH({ commit, state }, { platforms, sortQuery }) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/customSearch?platforms=${platforms}&sortQuery=${sortQuery}&token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          commit('CACHE_GAME_DATA', data);
          resolve(data);
        }).catch(reject);
    });
  },

  // SEARCH_GAMES({ commit, state }, { searchText, platforms, sortField, sortOrder }) {
  // TODO: user CUSTOM_SEARCH
  SEARCH_GAMES({ commit, state }, { searchText, platforms }) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/search?search=${searchText}&platform=${platforms}&token=${state.twitchToken.access_token}`)
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
      db.collection('tags')
        .doc(state.user.uid)
        .set(tags, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  GET_TWITCH_TOKEN({ commit }) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('app')
        .doc('twitch')
        .get()
        .then((doc) => {
          commit('SET_TWITCH_TOKEN', doc.data());
          resolve();
        })
        .catch(reject);
    });
  },

  SAVE_TAGS_NO_MERGE({ state }, tags) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('tags')
        .doc(state.user.uid)
        .set(tags, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_SETTINGS({ commit, state }, settings) {
    const db = firebase.firestore();

    return new Promise((resolve, reject) => {
      db.collection('settings')
        .doc(state.user.uid)
        .set(settings, { merge: true })
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

      db.collection('notes')
        .doc(state.user.uid)
        .set(state.notes, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_NOTES_NO_MERGE({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('notes')
        .doc(state.user.uid)
        .set(state.notes, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  // TODO: combine into single action
  SAVE_PROGRESSES_NO_MERGE({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('progresses')
        .doc(state.user.uid)
        .set(state.progresses, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_PROGRESSES({ state }) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('progresses')
        .doc(state.user.uid)
        .set(state.progresses, { merge: true })
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

  LOAD_GAME({ state }, gameId) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/game?gameId=${gameId}&token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          const [game] = data;

          resolve(game);
        }).catch(reject);
    });
  },
};
