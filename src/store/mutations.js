import Vue from 'vue';

export default {
  SET_BOARDS(state, boards) {
    state.boards = boards;
  },

  SET_BOARD(state, board) {
    state.board = board;
  },

  SET_GAME_BOARD(state, board) {
    state.board = board;
  },

  SET_BOARD_GAMES(state, boardGames) {
    state.boardGames = boardGames;
  },

  ADD_BOARD(state, board) {
    state.boards.push(board);
  },

  REMOVE_BOARD(state, boardId) {
    const boardIndex = state.boards.findIndex(({ id }) => id === boardId);

    state.boards.splice(boardIndex, 1);
  },

  SET_GAME_MODAL_DATA(state, gameModalData) {
    state.gameModalData = gameModalData;
  },

  CLEAR_GAME_MODAL_DATA(state) {
    state.gameModalData = null;
  },

  //
  // LEGACY STUFF
  //

  ADD_LIST_LEGACY(state, list) {
    if (!state.gameLists[state.platform.code]) {
      Vue.set(state.gameLists, state.platform.code, []);
    }

    state.gameLists[state.platform.code].push(list);
  },

  SET_PLATFORM_LEGACY(state, platform) {
    state.platform = platform;
  },

  SAVE_LIST_LEGACY(state, lists) {
    state.gameLists = lists;
  },

  REMOVE_GAME_LEGACY(state, { gameId, listId }) {
    const currentList = state.gameLists[state.platform.code][listId];

    currentList.games.splice(currentList.games.indexOf(gameId), 1);
  },

  MOVE_LIST_LEGACY(state, { from, to }) {
    const cutOut = state.gameLists[state.platform.code].splice(from, 1)[0];

    state.gameLists[state.platform.code].splice(to, 0, cutOut);
  },

  REMOVE_LIST_LEGACY(state, index) {
    state.gameLists[state.platform.code].splice(index, 1);
  },

  REMOVE_PLATFORM_LEGACY(state) {
    Vue.delete(state.gameLists, state.platform.code);
  },

  ADD_GAME_LEGACY(state, { gameId, listId }) {
    const currentList = state.gameLists[state.platform.code][listId];

    currentList.games.push(gameId);
  },

  SET_WALLPAPER_URL_LEGACY(state, url) {
    state.wallpaperUrl = url;
  },

  SET_GAME_LISTS_LEGACY(state, lists) {
    state.gameLists = lists;
  },

  //
  // STUFF THAT REMAINS THE SAME
  //
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

  CACHE_GAME_DATA(state, data) {
    data.forEach((game) => {
      Vue.set(state.games, game.id, { ...game });
    });
  },

  SET_SETTINGS(state, settings) {
    state.settings = settings;
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

  SET_TAGS(state, tags) {
    state.tags = tags;
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

  SET_NOTES(state, notes) {
    state.notes = notes;
  },

  SET_PROGRESSES(state, progresses) {
    state.progresses = progresses;
  },

  REMOVE_GAME_PROGRESS({ progresses }, gameId) {
    if (progresses[gameId]) {
      Vue.delete(progresses, gameId);
    }
  },

  SET_GAME_PROGRESS(state, { progress, gameId }) {
    state.progresses[gameId] = progress;
  },

  SET_GAME_NOTE(state, { note, gameId }) {
    state.notes[gameId] = note;
  },

  SET_DRAGGING_STATUS(state, status) {
    state.dragging = status;
  },

  REMOVE_GAME_NOTE(state, gameId) {
    if (state.notes[gameId]) {
      Vue.delete(state.notes, gameId);
    }
  },

  ADD_GAME_TAG(state, { tagName, gameId }) {
    state.tags[tagName].games.push(gameId);
  },

  REMOVE_GAME_TAG(state, { tagName, gameId }) {
    state.tags[tagName].games.splice(state.tags[tagName].games.indexOf(gameId), 1);
  },

  SET_SEARCH_RESULTS(state, results) {
    state.results = results;
  },

  CLEAR_SEARCH_RESULTS(state) {
    state.results = [];
  },

  UPDATE_SETTING(state, { key, value }) {
    state.settings[key] = value;
  },
};
