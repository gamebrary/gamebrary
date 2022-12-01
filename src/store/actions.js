// TODO: use Fandom/Wikia API https://pokemon.fandom.com/api/v1/Articles/List?expand=2&category=characters&limit=10000
import { FEATURED_BOARDS } from '@/constants';
import axios from 'axios';
import { firestore, storage } from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

// TODO: use env variable in command to determine environment

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
                ...board,
                id: doc.id,
                lastUpdated: board?.lastUpdated || 0,
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
        dateCreated: Date.now(),
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

  LOAD_FEATURED_BOARDS({ commit, state }) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('boards')
        .where('id', 'in', FEATURED_BOARDS)
        .get()
        .then((querySnapshot) => {
          const boards = querySnapshot.docs.map(doc => doc.data());

          resolve(boards);
        })
        .catch(reject);
    });
  },

  LOAD_PROFILES({ commit }) {
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

  LOAD_PUBLIC_PROFILE_BY_USERNAME(context, userName) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('profiles')
        .where('userName', '==', userName)
        .get()
        .then((docs) => {
          const [profile] = docs.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));

          if (!profile) return reject();

          resolve(profile);
        })
        .catch(reject);
    });
  },


  LOAD_PUBLIC_PROFILE_BY_USER_ID({ commit, state }, userId) {
    return new Promise((resolve, reject) => {
      const db = firestore();

      db.collection('profiles')
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const profile = doc.data();

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

  DELETE_WALLPAPER({ commit }, { ref }) {
    return new Promise((resolve, reject) => {
      storage().ref(ref).delete().then(() => {
        commit('REMOVE_WALLPAPER', ref);
        resolve();
      }).catch(reject);
    });
  },

  LOAD_FIREBASE_IMAGE(context, path) {
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
      const wallpapers = [];

      storage().ref(`${state.user.uid}/wallpapers`).listAll().then(({ items }) => {
        const refs = items.map(({ fullPath }) => (fullPath));

        refs.forEach((ref, index) => {
          storage().ref().child(ref).getDownloadURL().then((url) => {
            storage().ref(ref).getMetadata().then(({ size, name, updated }) => {
              wallpapers.push({ url, ref, size, name, updated });

              if (wallpapers.length === refs.length) {
                commit('SET_WALLPAPERS', wallpapers);
                resolve(wallpapers);
              }
            });
          })
          .catch(reject);
        });
      }).catch((e) => {
        reject(e);
      })
    });
  },

  UPLOAD_WALLPAPER({ state, commit }, file) {
    return new Promise((resolve, reject) => {
      storage()
        .ref(`${state.user.uid}/wallpapers/${file.name}`)
        .put(file)
        .then(({ state, metadata }) => {
          if (state === 'success') {
            storage().ref().child(metadata.fullPath).getDownloadURL().then((url) => {
              const wallpaper = {
                ref: metadata.fullPath,
                name: metadata.name,
                size: metadata.size,
                updated: metadata.updated,
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

  UPLOAD_PROFILE_AVATAR({ state, commit }, file) {
    return new Promise((resolve, reject) => {
      storage()
        .ref(`${state.user.uid}/avatars/${file.name}`)
        .put(file)
        .then(({ state, metadata }) => {
          return state === 'success'
            ? resolve(metadata.fullPath)
            : reject();
        })
        .catch(reject);
    });
  },

  SAVE_BOARD({ state }) {
    const db = firestore();

    return new Promise((resolve, reject) => {
      db.collection('boards')
        .doc(state.board.id)
        .set({ ...state.board, lastUpdated: Date.now() })
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  },

  SAVE_GAME_BOARD({ commit }, payload) {
    const db = firestore();
    // TODO: sanitize list games, remove undefined and null game ids

    const board = {
      ...payload,
      lastUpdated: Date.now(),
    };

    return new Promise((resolve, reject) => {
      db.collection('boards')
        .doc(board.id)
        .set(board, { merge: true })
        .then(() => {
          commit('SET_GAME_BOARD', board);
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

  LOAD_GAMES({ state, commit }, games) {
    return new Promise((resolve, reject) => {
      const data = `fields id,name,slug,rating,release_dates.*,name,cover.image_id; where id = (${ games }); limit 500;`;

      axios.get(`${API_BASE}/igdb?token=${state.twitchToken.access_token}&path=games&data=${data}`)
        .then(({ data }) => {
          commit('CACHE_GAME_DATA', data);
          resolve(data);
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
      if (additionalUserInfo?.profile) {
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
      const data = `fields
      *,
      age_ratings.*,
      alternative_names.*,
      bundles.*,
      collection.*,
      collection.games.*,
      cover.image_id,
      external_games.*,
      game_modes.name,
      genres.name,
      involved_companies.company.name,
      involved_companies.developer,
      involved_companies.publisher,
      name,
      platforms.id,
      platforms.name,
      player_perspectives.name,
      rating,
      release_dates.date,
      release_dates.platform,
      screenshots.image_id,
      similar_games,
      summary,
      slug,
      videos.video_id,
      websites.category,
      websites.url;

      where id = ${gameId};`;

      axios.get(`${API_BASE}/igdb?token=${state.twitchToken.access_token}&path=games&data=${data}`)
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
