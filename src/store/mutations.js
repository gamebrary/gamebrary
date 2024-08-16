import Vue from 'vue';

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

  SET_ACTIVE_WALLPAPER(state, activeWallpaper) {
    state.activeWallpaper = activeWallpaper;
  },

  SET_ACTIVE_BOARD_LIST_INDEX(state, listIndex) {
    state.activeBoardListIndex = listIndex;
  },

  CLEAR_ACTIVE_BOARD_LIST_INDEX(state) {
    state.activeBoardListIndex = null;
  },
  
  CLEAR_ACTIVE_WALLPAPER(state) {
    state.activeWallpaper = {};
  },

  SET_HIGHLIGHTED_GAME(state, gameId) {
    state.highlightedGame = gameId;
  },

  CLEAR_BOARD(state) {
    state.board = {};
  },

  SET_ACTIVE_BOARD(state, board) {
    state.board = board;

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
  
  SET_MENU_OPEN(state, menuOpen) {
    state.menuOpen = Boolean(menuOpen);
  },

  MOVE_LIST_LEFT(state, listIndex) {
    if (listIndex <= 0) return;

    const [list] = state.board.lists.splice(listIndex, 1);

    state.board.lists.splice(listIndex - 1, 0, list);
  },

  MOVE_LIST_RIGHT(state, listIndex) {
    const listsCount = state.board?.lists?.length || 0;
    
    if (listIndex > listsCount - 1) return;
    
    const [list] = state.board.lists.splice(listIndex, 1);
    
    state.board.lists.splice(listIndex + 1, 0, list);
  },
  
  SET_PROFILE_SIDEBAR_OPEN(state, open) {
    state.editProfileSidebarOpen = Boolean(open);
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

  SET_GAME(state, [game]) {
    state.game = game;
  },

  CLEAR_GAME(state) {
    state.game = null;
  },

  SET_GAME_SELECTOR_DATA(state, data) {
    state.gameSelectorData = data;
  },

  CLEAR_GAME_SELECTOR_DATA(state) {
    state.gameSelectorData = null;
  },

  APPEND_STEAM_GAME_DATA(state, data) {
    Vue.set(state.game, 'steam', data);
  },

  LIKE_GAME(state, gameId) {
    Vue.set(state.games, gameId, true);
  },

  UNLIKE_GAME(state, gameId) {
    Vue.set(state.games, gameId, false);
  },

  APPEND_GAME_NEWS(state, news) {
    Vue.set(state.game, 'news', news);
  },

  APPEND_WIKIPEDIA_GAME_DATA(state, data) {
    Vue.set(state.game, 'wikipedia', data);
  },

  APPEND_GAME_SPEEDRUNS(state, { data }) {
    Vue.set(state.game, 'speedruns', data);
  },

  APPEND_GAME_SPEEDRUN_ID(state, speedrunId) {
    if (state.game !== null) {
      Vue.set(state.game, 'speedrunId', speedrunId);
    }
  },

  APPEND_GOG_GAME_DATA(state, data) {
    Vue.set(state.game, 'gog', data);
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

  CACHE_GAME_DATA(state, games) {
    games.forEach((game) => {
      Vue.set(state.cachedGames, game.id, { ...game });
    });
  },

  CLEAR_CACHE_GAME_DATA(state) {
    state.cachedGames = {};
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
    state.platforms = [];
    state.cachedGames = {};
    state.games = {};
    state.boards = [];
    state.board = {};
    state.wallpaperUrl = null;
    state.wallpapers = [];
  },

  SET_NOTES(state, notes) {
    state.notes = notes;
  },

  SET_GAMES(state, games) {
    state.games = games;
  },

  SET_PLATFORMS(state, platforms) {
    state.platforms = platforms;
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

  UPDATE_SETTING(state, { key, value }) {
    if (!state.settings) {
      state.settings = {};
    }

    state.settings[key] = value;
  },

  // TAGS
  APPLY_TAG_TO_GAME(state, { tagIndex, gameId }) {
    state.tags[tagIndex].games.push(gameId);
  },

  REMOVE_GAME_FROM_TAG(state, { tagIndex, gameId }) {
    const gameIndex = state.tags[tagIndex].games.indexOf(gameId);

    state.tags[tagIndex].games.splice(gameIndex, 1);
  },

  UPDATE_TAG(state, { tagIndex, tag }) {
    state.tags[tagIndex] = JSON.parse(JSON.stringify(tag));
  },

  SET_TAGS(state, tags) {
    state.tags = tags;
  },

  REMOVE_TAG(state, tagIndex) {
    state.tags.splice(tagIndex, 1);
  },

  // TAGS v2
  CREATE_TAG(state, tag) {
    state.tags.push(tag);
  },
};
