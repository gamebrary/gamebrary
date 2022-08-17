import Vue from 'vue';
// import {
//   // PLATFORM_CATEGORIES,
//   // EXCLUDED_PLATFORMS,
//   // PLATFORM_BG_HEX,
//   // PLATFORM_LOGO_FORMAT,
//   // PLATFORM_NAME_OVERRIDES,
//   // POPULAR_PLATFORMS,
// } from '@/constants';

export default {
  SET_BOARDS(state, boards) {
    state.boards = boards;
  },

  SET_SESSION_EXPIRED(state, sessionExpired) {
    state.sessionExpired = sessionExpired;
  },

  SET_RELEASES(state, releases) {
    state.releases = releases;
  },

  SET_NOTIFICATION(state, notification) {
    state.notification = notification;
  },

  SET_TWITCH_TOKEN(state, token) {
    state.twitchToken = token;
  },

  CLEAR_BOARD(state) {
    state.board = {};
  },

  // TODO: remove, deprecated
  SET_ACTIVE_BOARD(state, board) {
    state.board = board;

    // Update board in boards
    const boardIndex = state.boards.findIndex(({ id }) => board.id === id);

    if (boardIndex) {
      Vue.set(state.boards, boardIndex, board);
    }
  },

  SET_PUBLIC_BOARDS(state, publicBoards) {
    state.publicBoards = publicBoards;
  },

  SET_GAME_BOARD(state, board) {
    state.board = board;
  },

  SET_PROFILE(state, profile) {
    state.profile = profile;
  },

  REMOVE_PROFILE(state) {
    state.profile = {};
  },

  SET_PROFILES(state, profiles) {
    state.profiles = profiles;
  },

  SET_PLATFORMS(state, platforms) {
    // TODO: use getter instead to get fresh data right away instead of once per session
    state.platforms = platforms;
    // state.platforms = platforms
    //   .filter(({ id }) => !EXCLUDED_PLATFORMS.includes(id))
    //   .map((platform) => {
    //     const formattedPlatform = {
    //       id: platform.id,
    //       name: PLATFORM_NAME_OVERRIDES[platform.id] || platform.name,
    //       slug: platform.slug,
    //       category: PLATFORM_CATEGORIES[platform.category],
    //       popular: POPULAR_PLATFORMS.includes(platform.id),
    //       // categoryId: platform.category,
    //       generation: platform.generation || 0,
    //       bgHex: PLATFORM_BG_HEX[platform.id] || null,
    //       logoFormat: PLATFORM_LOGO_FORMAT[platform.id] || 'svg',
    //     };
    //
    //     return formattedPlatform;
    //   });
  },

  SET_BOARD_GAMES(state, boardGames) {
    state.boardGames = boardGames;
  },

  SET_WALLPAPERS(state, wallpapers) {
    state.wallpapers = wallpapers;
  },

  REMOVE_WALLPAPER(state, fullPath) {
    const wallpaperIndex = state.wallpapers.findIndex(wallpaper => wallpaper.fullPath === fullPath);

    state.wallpapers.splice(wallpaperIndex, 1);
  },

  ADD_WALLPAPER(state, wallpaper) {
    state.wallpapers.push(wallpaper);
  },

  ADD_BOARD(state, board) {
    state.boards.push(board);
  },

  ADD_LIST(state, list) {
    state.board.lists.push(list);
  },

  REMOVE_BOARD(state, boardId) {
    const boardIndex = state.boards.findIndex(({ id }) => id === boardId);

    state.boards.splice(boardIndex, 1);
  },

  SET_GAME(state, game) {
    state.game = game;
  },

  CLEAR_GAME(state) {
    state.game = null;
  },

  APPEND_STEAM_GAME_DATA(state, data) {
    console.log('data', data);
    state.game.steam = data;
  },

  APPEND_GAME_NEWS(state, news) {
    state.game.news = news;
  },

  APPEND_WIKIPEDIA_GAME_DATA(state, data) {
    state.game.wikipedia = data;
  },

  APPEND_GAME_SPEEDRUNS(state, data) {
    console.log('game', state.game);
    Vue.set(state.game, 'speedruns', data);
  },

  APPEND_GOG_GAME_DATA(state, data) {
    state.game.gog = data;
  },

  MOVE_LIST(state, { from, to }) {
    const cutOut = state.board.lists.splice(from, 1)[0];

    state.board.lists.splice(to, 0, cutOut);
  },

  SET_USER(state, data) {
    const [{ providerId }] = data.providerData;

    state.user = {
      lastLogin: data.metadata.lastSignInTime,
      uid: data.uid,
      displayName: data.displayName,
      email: data.email,
      emailVerified: data.emailVerified,
      dateJoined: data.metadata.creationTime,
      photoURL: data.photoURL,
      providerId,
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

  CLEAR_SESSION(state) {
    state.user = null;
    state.tags = [];
    state.notes = {};
    state.progresses = {};
    state.profile = {};
    state.profiles = [];
    state.dragging = false;
    state.settings = null;
    state.platform = null;
    state.platforms = [];
    state.results = [];
    state.games = {};
    state.boards = [];
    state.board = {};
    state.boardGames = [];
    state.wallpaperUrl = null;
    state.wallpapers = [];
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

  SET_SEARCH_RESULTS(state, results) {
    state.results = results;
  },

  CLEAR_SEARCH_RESULTS(state) {
    state.results = [];
  },

  UPDATE_SETTING(state, { key, value }) {
    if (!state.settings) {
      state.settings = {};
    }

    state.settings[key] = value;
  },

  // TAGS
  APPLY_TAG_TO_GAME(state, tagIndex) {
    state.tags[tagIndex].games.push(state.game.id);
  },

  REMOVE_GAME_FROM_TAG(state, tagIndex) {
    const gameIndex = state.tags[tagIndex].games.indexOf(state.game.id);

    state.tags[tagIndex].games.splice(gameIndex, 1);
  },

  UPDATE_TAG(state, { tagIndex, tag }) {
    state.tags[tagIndex] = JSON.parse(JSON.stringify(tag));
  },

  SET_TAGS(state, tags) {
    state.tags = tags;
  },

  // TAGS v2
  CREATE_TAG(state, tag) {
    state.tags.push(tag);
  },
};
