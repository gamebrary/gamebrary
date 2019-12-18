import Vue from 'vue';

export default {
  SET_USER(state, data) {
    state.user = {
      lastLogin: data.metadata.lastSignInTime,
      uid: data.uid,
      displayName: data.displayName,
      email: data.email,
      emailVerified: data.emailVerified,
      dateJoined: data.metadata.creationTime,
      photoURL: data.photoURL,
    };
  },

  SET_GAME_LISTS(state, lists) {
    state.gameLists = lists;
  },

  SET_SLIDESHOW_OPEN(state, status) {
    state.galleryOpen = status;
  },

  SET_WALLPAPER_URL(state, url) {
    state.wallpaperUrl = url;
  },

  UPDATE_TAG(state, { tagName, tagHex, tempTag }) {
    const updatedTag = {
      ...state.tags[tempTag.tagName],
      hex: tagHex,
    };

    const renaming = tagName !== tempTag.tagName;

    if (renaming) {
      Vue.set(state.tags, tagName, updatedTag);
      Vue.delete(state.tags, tempTag.tagName);
    } else {
      state.tags[tempTag.tagName] = updatedTag;
    }
  },

  SET_RELEASES(state, releases) {
    state.releases = releases;
  },

  SET_TAGS(state, tags) {
    state.tags = tags;
  },

  SET_DRAGGING_STATUS(state, status) {
    state.dragging = status;
  },

  SET_NOTES(state, notes) {
    state.notes = notes;
  },

  SET_PROGRESSES(state, progresses) {
    state.progresses = progresses;
  },

  REMOVE_GAME_PROGRESS({ game, progresses, platform }) {
    const progressExists = game && progresses[platform.code] && progresses[platform.code][game.id];

    if (progressExists) {
      Vue.delete(progresses[platform.code], game.id);
    }
  },

  SET_GAME_PROGRESS(state, value) {
    if (!state.progresses[state.platform.code]) {
      state.progresses[state.platform.code] = {};
    }

    state.progresses[state.platform.code][state.game.id] = value;
  },

  SET_GAME_NOTE(state, note) {
    state.notes[state.game.id] = note;
  },

  REMOVE_GAME_NOTE({ game, notes }) {
    const noteExists = game && notes[game.id];

    if (noteExists) {
      Vue.delete(notes, game.id);
    }
  },

  ADD_GAME_TAG(state, { tagName, gameId }) {
    state.tags[tagName].games.push(gameId);
  },

  REMOVE_GAME_TAG(state, { tagName, gameId }) {
    state.tags[tagName].games.splice(state.tags[tagName].games.indexOf(gameId), 1);
  },

  CLEAR_SESSION(state) {
    state.user = null;
    state.activeListIndex = null;
    state.gameLists = {};
    state.settings = null;
    state.platform = null;
    state.results = null;
    state.games = {};
    state.publicGameData = {};
    state.game = null;
  },

  SET_SEARCH_RESULTS(state, results) {
    state.results = results;
  },

  CLEAR_SEARCH_RESULTS(state) {
    state.results = [];
  },

  SET_ACTIVE_GAME(state, [game]) {
    state.game = game;
  },

  CLEAR_ACTIVE_GAME(state) {
    state.game = null;
  },

  SET_EDIT_GAME(state, { listId, gameId }) {
    state.editGame = gameId;
    state.activeListIndex = listId;
  },

  SET_ACTIVE_LIST_INDEX(state, listIndex) {
    state.activeListIndex = listIndex;
  },

  CLEAR_ACTIVE_LIST_INDEX(state) {
    state.activeListIndex = null;
    state.addingList = false;
  },

  SET_PLATFORM(state, platform) {
    state.platform = platform;
  },

  SAVE_LISTS(state, lists) {
    state.gameLists = lists;
  },

  UPDATE_LIST_TYPE(state, { listIndex, type }) {
    state.gameLists[state.platform.code][listIndex].type = type;
  },

  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },

  UPDATE_SETTING(state, { key, value }) {
    state.settings[key] = value;
  },

  MOVE_LIST(state, { from, to }) {
    const cutOut = state.gameLists[state.platform.code].splice(from, 1)[0];

    state.gameLists[state.platform.code].splice(to, 0, cutOut);
  },

  REMOVE_LIST(state, index) {
    state.gameLists[state.platform.code].splice(index, 1);
  },

  REMOVE_PLATFORM(state) {
    Vue.delete(state.gameLists, state.platform.code);
  },

  ADD_GAME(state, { gameId, listId }) {
    const currentList = state.gameLists[state.platform.code][listId];

    currentList.games.push(gameId);
  },

  ADD_LIST(state, list) {
    if (!state.gameLists[state.platform.code]) {
      Vue.set(state.gameLists, state.platform.code, []);
    }

    state.gameLists[state.platform.code].push(list);
  },

  REMOVE_GAME(state, { gameId, listId }) {
    const currentList = state.gameLists[state.platform.code][listId];

    currentList.games.splice(currentList.games.indexOf(gameId), 1);
  },

  CACHE_GAME_DATA(state, data) {
    data.forEach((game) => {
      Vue.set(state.games, game.id, { ...game });
    });
  },

  SET_PUBLIC_GAME_DATA(state, data) {
    data.forEach((game) => {
      Vue.set(state.publicGameData, game.id, { ...game });
    });
  },
};
