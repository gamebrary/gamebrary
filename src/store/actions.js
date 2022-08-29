import axios from 'axios';
import { firestore, storage } from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
// const API_BASE = 'http://localhost:5001/gamebrary-8c736/us-central1';

export default {
  LOAD_SPEEDRUN_GAME({ commit }, gameName) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.speedrun.com/api/v1/games?name=${gameName}`)
        .then(({ data }) => {
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_GAME_SPEEDRUN_RUNS({ commit }, runUrl) {
    return new Promise((resolve, reject) => {
      axios.get(runUrl)
        .then(({ data }) => {
          commit('APPEND_GAME_SPEEDRUNS', data);
          resolve(data);
        }).catch(reject);
    });
  },

  SUBSCRIBE_TO_NEWSLETTER({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('https://forms.keapapis.com/api/v1/public/forms/5330437182324736/submissions')
        .then(({ data }) => {
          // commit('APPEND_GAME_SPEEDRUNS', data);
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_IGDB_PLATFORMS({ state, commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/platforms?token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          commit('SET_PLATFORMS', data);
          resolve(data);
        }).catch(reject);
    });
  },

  IGDB({ state }, { path, data }) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/igdb?token=${state.twitchToken.access_token}&path=${path}&data=${data}`)
        .then(({ data }) => {
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_WIKIPEDIA_ARTICLE({ commit }, articleTitle) {
    return new Promise((resolve, reject) => {
      axios.get(`https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${articleTitle}`)
        .then(({ data }) => {
          commit('APPEND_WIKIPEDIA_GAME_DATA', data);

          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_WIKIPEDIA_DESCRIPTION(context, articleTitle) {
    return new Promise((resolve, reject) => {
      axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${articleTitle}&prop=extracts&exintro&origin=*`)
        .then(({ data }) => {
          resolve(data);
        }).catch(reject);
    });
  },

  LOAD_STEAM_GAME_NEWS({ commit }, steamGameId) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/steam-news?appId=${steamGameId}`)
        .then(({ data }) => {
          const gameNews = data && data.appnews && data.appnews.newsitems
            ? data.appnews.newsitems
            : null;

          commit('APPEND_GAME_NEWS', gameNews);
          resolve(gameNews);
        }).catch(reject);
    });
  },

  LOAD_STEAM_GAME({ commit }, steamGameId) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/steam-game?gameId=${steamGameId}`)
        .then(({ data }) => {
          // TODO: move this logic to cloud function
          const steamGameData = data[steamGameId];

          const gameData = steamGameData.success
            ? steamGameData.data
            : null;

          commit('APPEND_STEAM_GAME_DATA', gameData);

          resolve(gameData);
        }).catch(reject);
    });
  },

  LOAD_BOARDS({ state, commit }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

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
      const db = firestore();

      db.collection('boards')
        .doc(id)
        .get()
        .then((doc) => {
          const boardData = doc.data();

          const boardNotFound = !doc.exists;
          const forbiddenTenant = !boardData?.isPublic && boardData?.owner !== state?.user?.uid;

          if (boardNotFound || forbiddenTenant) return reject();

          const board = { ...boardData, id: doc.id };

          commit('SET_ACTIVE_BOARD', board);
          return resolve(board);
        })
        .catch(reject);
    });
  },

  LOAD_PUBLIC_BOARDS({ commit }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

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
      const db = firestore();

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

  LOAD_PROFILE({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('profiles')
        .doc(state.user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const profile = doc.data();

            commit('SET_PROFILE', profile);
            resolve(profile);
          } else {
            commit('REMOVE_PROFILE');
            reject();
          }
        })
        .catch(reject);
    });
  },

  LOAD_PROFILES({ commit }) {
    // TODO: paginate
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('profiles')
        .get()
        .then((querySnapshot) => {
          const profiles = querySnapshot.docs.map(doc => doc.data());

          commit('SET_PROFILES', profiles);

          return resolve(profiles);
        })
        .catch(reject);
    });
  },

  LOAD_PUBLIC_PROFILE(context, userName) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('profiles')
        .where('userName', '==', userName)
        .get()
        .then((docs) => {
          const [profile] = docs.docs.map(doc => doc.data());

          if (profile) {
            resolve(profile);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  },

  LOAD_USER_PUBLIC_BOARDS(context, userId) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('boards')
        .where('owner', '==', userId)
        .where('isPublic', '==', true)
        .get()
        .then((querySnapshot) => {
          const boards = querySnapshot.docs.map(doc => doc.data());

          resolve(boards);
        })
        .catch(reject);
    });
  },

  // db.collection("users")
  // .doc("3P86VJxcpBK0D0lsAyYx")
  // .set({
  //   name: "Lee Kuan",
  // });


  DELETE_PROFILE({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('profiles')
        .doc(state.user.uid)
        .delete()
        .then(() => {
          commit('REMOVE_PROFILE');
          resolve();
        })
        .catch(reject);
    });
  },

  SAVE_PROFILE({ commit, state }, profile) {
    const db = firestore();

    return new Promise((resolve, reject) => {
      db.collection('profiles')
        .doc(state.user.uid)
        .set(profile)
        .then(() => {
          commit('SET_PROFILE', profile);
          resolve();
        })
        .catch(reject);
    });
  },

  CHECK_PROFILE_USERNAME_AVAILABILITY(context, userName) {
    const db = firestore();

    return new Promise((resolve, reject) => {
      db.collection('profiles')
        .where('userName', '==', userName)
        .get()
        .then(({ docs }) => {
          const available = !docs || Object.keys(docs).length === 0;

          resolve(available);
        })
        .catch(reject);
    });
  },

  DELETE_WALLPAPER({ commit }, { fullPath }) {
    return new Promise((resolve, reject) => {
      storage()
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
      storage()
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
      storage()
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
            storage()
              .ref()
              .child(fullPath)
              .getDownloadURL()
              .then((url) => {
                fetchedUrls.push(url);

                wallpapers[index].url = url;

                if (fetchedUrls.length === wallpapers.length) {
                  const fetchedMetadatas = [];

                  wallpapers.forEach((wallpaper, i) => {
                    storage()
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
      storage()
        .ref(`${state.user.uid}/wallpapers/${file.name}`)
        .put(file)
        .then((response) => {
          if (response.state === 'success') {
            const { metadata: { fullPath, name } } = response;

            storage()
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
    const db = firestore();

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

  SAVE_GAME_BOARD({ state }, board) {
    const db = firestore();

    // TODO: commit mutation if we ever allow to add game directly from board
    return new Promise((resolve, reject) => {
      db.collection('boards')
        .doc(board.id)
        .set(board, { merge: true })
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  },

  DELETE_BOARD({ commit }, id) {
    return new Promise((resolve, reject) => {
      const db = firestore();

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

  LOAD_GOG_GAME({ commit }, search) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/gog?search=${search}`)
        .then(({ data }) => {
          const gogGame = data?.products?.length > 0
            ? data.products[0]
            : null;

          if (gogGame) commit('APPEND_GOG_GAME_DATA', gogGame);
          resolve()
        }).catch(reject);
    });
  },

  SEARCH_BOARD_GAMES({ commit, state }, searchText) {
    const platforms = state.board.platforms.length > 0
      ? `&platform=${state.board.platforms.join(',')}`
      : '';

    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/search?search=${searchText}${platforms}&token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          commit('SET_SEARCH_RESULTS', data);
          commit('CACHE_GAME_DATA', data);
          resolve();
        }).catch(reject);
    });
  },

  // SEARCH_GAMES({ commit, state }, { searchText, platforms, sortField, sortOrder }) {
  // TODO: remove?
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

  GET_TWITCH_TOKEN({ commit }) {
    const db = firestore();

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

  SAVE_SETTINGS({ commit, state }, settings) {
    const db = firestore();

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
      const db = firestore();

      db.collection('notes')
        .doc(state.user.uid)
        .set(state.notes, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_NOTES_NO_MERGE({ state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

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
      const db = firestore();

      db.collection('progresses')
        .doc(state.user.uid)
        .set(state.progresses, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SAVE_PROGRESSES({ state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('progresses')
        .doc(state.user.uid)
        .set(state.progresses, { merge: true })
        .then(() => resolve())
        .catch(reject);
    });
  },

  SYNC_LOAD_SETTINGS({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('settings')
        .doc(state.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const settings = doc.data();

            commit('SET_SETTINGS', settings);
            resolve();
          } else {
            reject();
          }
        });
    });
  },

  LOAD_SETTINGS({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('settings')
        .doc(state.user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const settings = doc.data();

            commit('SET_SETTINGS', settings);
            resolve();
          } else {
            commit('SET_SESSION_EXPIRED', true);
            reject();
          }
        });
    });
  },

  SYNC_LOAD_NOTES({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('notes')
        .doc(state.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const notes = doc.data();

            commit('SET_NOTES', notes);
            resolve();
          } else {
            reject();
          }
        });
    });
  },

  SYNC_LOAD_PROGRESSES({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('progresses')
        .doc(state.user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const progresses = doc.data();

            commit('SET_PROGRESSES', progresses);
            resolve();
          } else {
            reject();
          }
        });
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
          // const [latestRelease] = data;
          // const latestReleaseVersion = latestRelease && latestRelease.tag_name;
          // const lastReleaseSeenByUser = this.settings?.release || null;
          //
          // if (latestReleaseVersion !== lastReleaseSeenByUser) {
          //   commit('SET_NOTIFICATION', true);
          // }

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

  LOAD_GAME({ state, commit }, gameId) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_BASE}/game?gameId=${gameId}&token=${state.twitchToken.access_token}`)
        .then(({ data }) => {
          const [game] = data;

          commit('SET_GAME', game);

          resolve(game);
        }).catch(reject);
    });
  },

  // TAGS
  SAVE_TAGS({ state }) {
    const db = firestore();

    return new Promise((resolve, reject) => {
      db.collection('tags')
        .doc(state.user.uid)
        .set({ tags: state.tags }, { merge: false })
        .then(() => resolve())
        .catch(reject);
    });
  },

  // SYNC_LOAD_TAGS({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     const db = firestore();
  //
  //     db.collection('tags')
  //       .doc(state.user.uid)
  //       .onSnapshot((doc) => {
  //         if (doc.exists) {
  //           const tags = doc.data();
  //
  //           const sortedTags = Object.keys(tags)
  //             .sort()
  //             .reduce((res, key) => (res[key] = tags[key], res), {});
  //
  //           const mappedTags = Object.entries(sortedTags).map((t) => {
  //             const [name, tag] = t;
  //
  //             return { name, ...tag };
  //           })
  //
  //           commit('SET_TAGS', mappedTags);
  //           resolve();
  //         } else {
  //           reject();
  //         }
  //       });
  //   });
  // },

  LOAD_TAGS({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('tags')
        .doc(state.user.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) return reject();

          const { tags } = doc.data();

          if (typeof tags === 'object') {
            // console.warn('Legacy tag detected');
            const formattedTags = Object.entries(tags).map(([ ,tag]) => ({ ...tag }));

            commit('SET_TAGS', formattedTags);
            resolve(formattedTags);
          } else {
            // console.log('is type', typeof tags);
          }
        });
    });
  },
};
