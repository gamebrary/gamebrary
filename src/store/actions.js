// TODO: restore firestore rules and make them tight!
// TODO: use Fandom/Wikia API
// https://megaman.fandom.com/api.php?action=parse&format=json&page=Mega_Man_II&prop=sections|images
// https://megaman.fandom.com/api.php?action=parse&page=Mega_Man_II&format=json&prop=wikitext&section=2

import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_CONFIG } from '@/constants';
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();

const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
// const API_BASE = 'http://localhost:5001/gamebrary-8c736/us-central1';

export default {
// MIGRATED
async SIGN_UP_WITH_EMAIL({ state, commit }, board) {
	createUserWithEmailAndPassword(auth, this.email, this.password)
	  .then((userCredential) => {
		console.log(userCredential);
		// Signed up
		const user = userCredential.user;
		// ...
		// TODO: redirect to home
	  })
	  .catch((error) => {
		this.handleError(error.code)
		this.loading = false;
	  });

	const docRef = await addDoc(collection(db, 'boards'), board);
	const newBoard = { ...board, id: docRef.id };

	commit('ADD_BOARD', newBoard);

	return newBoard;
},

async CREATE_BOARD({ state, commit }, board) {
	const docRef = await addDoc(collection(db, 'boards'), board);
	const newBoard = { ...board, id: docRef.id };

	commit('ADD_BOARD', newBoard);

	return newBoard;
},

async SAVE_NOTES_NO_MERGE({ state }) {
	await setDoc(doc(db, 'notes', state.user.uid), state.notes, { merge: false });
},

async SIGN_OUT({ commit }) {
    await signOut(auth);
},

async LOAD_BOARDS({ state, commit }) {
  const q = query(collection(db, 'boards'), where('owner', '==', state.user.uid));

  const querySnapshot = await getDocs(q);
  const boards = querySnapshot.docs.map((doc) => ({
    lastUpdated: 0,
    ...doc.data(),
    id: doc.id,
  }));

  commit('SET_BOARDS', boards);
},

async LOAD_FIREBASE_IMAGE(context, path) {
  await getDownloadURL(ref(storage, path));
},

async LOAD_USER_PUBLIC_BOARDS(context, userId) {
  const query = query(collection(db, 'boards'), where('owner', '==', userId), where('isPublic', '==', true));
  const querySnapshot = await getDocs(query);

  return querySnapshot.docs.map(doc => doc.data());
},

async LOAD_PUBLIC_PROFILE_BY_USERNAME(context, userName) {
  const query = query(collection(db, 'profiles'), where('userName', '==', userName));
  const querySnapshot = await getDocs(query);

  const [profile] = querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));

  return profile;
},

async LOAD_PROFILES({ commit }) {
  const querySnapshot = await getDocs(query(collection(db, 'profiles')));
  const profiles = querySnapshot.docs.map(doc => doc.data());

  commit('SET_PROFILES', profiles);
},

async LOAD_SETTINGS({ commit, state }) {
  const docSnap = await getDoc(doc(db, 'settings', state.user.uid));

  console.log('docSnap.data()', docSnap.data());

  commit('SET_SETTINGS', docSnap.data());
},

async LOAD_NOTES({ commit, state }) {
  const docSnap = await getDoc(doc(db, 'notes', state.user.uid));

  commit('SET_NOTES', docSnap.data());
},

async LOAD_TAGS({ commit, state }) {
  const docSnap = await getDoc(doc(db, 'tags', state.user.uid));
  const { tags } = docSnap.data();
  const formattedTags = Object.entries(tags).map(([ ,tag]) => ({ ...tag }));

  commit('SET_TAGS', formattedTags);
},

async GET_TWITCH_TOKEN({ commit }) {
  const docRef = doc(db, 'app', 'twitch');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) commit('SET_TWITCH_TOKEN', docSnap.data());
},

async LOAD_PUBLIC_BOARDS({ commit }) {
  const query = query(collection(db, 'boards'), where('isPublic', '==', true));
  const querySnapshot = await getDocs(query);
  const boards = querySnapshot.docs.map(doc => doc.data());

  commit('SET_PUBLIC_BOARDS', boards);
},

async SAVE_TAGS({ state }) {
  await setDoc(doc(db, 'tags', state.user.uid), { tags: state.tags }, { merge: false });
},

async SAVE_SETTINGS({ commit, state }, settings) {
  await setDoc(doc(db, 'settings', state.user.uid), settings);

  commit('SET_SETTINGS', settings);
},

async SAVE_NOTES({ state }) {
  await setDoc(doc(db, 'notes', state.user.uid), state.notes, { merge: true });
},

async SAVE_GAMES({ state }) {
  await setDoc(doc(db, 'games', state.user.uid), state.games);
},

// TO BE MIGRATED
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

LOAD_PROGRESSES({ commit, state }) {
  return new Promise((resolve, reject) => {
    const db = firestore();

    db.collection('progresses')
      .doc(state.user.uid)
      .get()
      .then((doc) => {
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

async LOAD_BOARD({ state, commit }, id) {
  return new Promise(async (resolve, reject)=> {
    const docRef = doc(db, 'boards', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const boardData = docSnap.data();
      const forbiddenTenant = !boardData?.isPublic && boardData?.owner !== state?.user?.uid;

      if (forbiddenTenant) throw 'Forbidden';

      const board = { ...boardData, id: docSnap.id };

      commit('SET_ACTIVE_BOARD', board);

      return resolve(board);
    } else {
      console.log('not found');
    };
  });

  // return new Promise((resolve, reject) => {
  //   const db = firestore();
  //
  //   // db.collection('boards')
  //   //   .doc(id)
  //   //   .get()
  //   //   .then((doc) => {
    //     const boardData = doc.data();
  //   //
  //   //
  //   //     return resolve(board);
  //   //   })
  //   //   .catch(reject);
  // });
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

LOAD_PUBLIC_PROFILE_BY_USER_ID({ commit, state }, userId) {
  return new Promise((resolve, reject) => {
    const db = firestore();

    db.collection('profiles')
      .doc(userId)
      .get()
      .then((doc) => {
        if (!doc.exists) return reject();

        const profile = doc.data();

        resolve(profile);
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

LOAD_WALLPAPERS({ state, commit }) {
  return new Promise((resolve, reject) => {
    const wallpapers = [];

    storage().ref(`${state.user.uid}/wallpapers`).listAll().then(({ items }) => {
      const refs = items.map(({ fullPath }) => (fullPath));

      if (refs?.length === 0) return resolve();

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
  console.log('id', id);
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

async LOAD_GAMES({ commit, state }) {
  const docRef = doc(db, 'games', state.user.uid);
  const docSnap = await getDoc(docRef);

  commit('SET_GAMES', docSnap.data());
},



// EXTERNAL, clean up, use await, etc...
GET_SPEEDRUN_GAME_ID({ commit, dispatch }, gameName) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.speedrun.com/api/v1/games?name=${gameName}`)
      .then(({ data }) => {
        const speedRunGameId = data?.data?.[0]?.id;

        if (speedRunGameId) {
          commit('APPEND_GAME_SPEEDRUN_ID', speedRunGameId);
          dispatch('LOAD_GAME_SPEEDRUN_RUNS', speedRunGameId);
          resolve(speedRunGameId);
        }
      }).catch(reject);
  });
},

LOAD_GAME_SPEEDRUN_RUNS({ commit }, gameId) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.speedrun.com/api/v1/runs?game=${gameId}`)
      .then(({ data }) => {
        commit('APPEND_GAME_SPEEDRUNS', data);
        resolve(data);
      }).catch(reject);
  });
},

LOAD_FANDOM_DATA({ commit }, { subdomain, pageName }) {
  return new Promise((resolve, reject) => {
    axios.get(`https://cors-anywhere.herokuapp.com/https://${subdomain}.fandom.com/api.php?action=parse&format=json&page=${pageName}&prop=sections|images`)
      .then(({ data }) => {
        // commit('APPEND_GAME_SPEEDRUNS', data);
        resolve(data);
      }).catch(reject);
  });
},

SUBSCRIBE_TO_NEWSLETTER({ commit }) {
  return new Promise((resolve, reject) => {
    axios.post('https://forms.keapapis.com/api/v1/public/forms/5330437182324736/submissions')
      .then(({ data }) => {
        resolve(data);
      }).catch(reject);
  });
},

IGDB({ state, commit }, { path, data, mutation }) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/igdb?token=${state.twitchToken.access_token}&path=${path}&data=${data}`)
      .then(({ data }) => {
        if (mutation) commit(mutation, data);

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
        const gameNews = data?.appnews?.newsitems || null;

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

LOAD_IGDB_GAMES({ state, commit }, games) {
  return new Promise((resolve, reject) => {
    const data = `fields id,name,platforms,slug,rating,release_dates.*,name,cover.image_id; where id = (${ games }); limit 500;`;

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
};
