import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    menuOpen: true,
    editProfileSidebarOpen: false,
    routeName: null,
    draggingGameId: null,
    gameSelectorData: null,
    highlightedGame: null,
    activeWallpaper: {},
    activeTagIndex: null,
    activeBoardListIndex: null,
    notification: false,
  }),

  persist: {
    paths: ['menuOpen'],
  },

  getters: {
    dragging: (state) => Boolean(state.draggingGameId),
  },

  actions: {
    setMenuOpen(open) {
      this.menuOpen = Boolean(open);
    },

    setEditProfileSidebarOpen(open) {
      this.editProfileSidebarOpen = Boolean(open);
    },

    setRouteName(routeName) {
      this.routeName = routeName;
    },

    setDraggingGameId(gameId) {
      this.draggingGameId = gameId;
    },

    clearDraggingGameId() {
      this.draggingGameId = null;
    },

    setGameSelectorData(data) {
      this.gameSelectorData = data;
    },

    clearGameSelectorData() {
      this.gameSelectorData = null;
    },

    setHighlightedGame(gameId) {
      this.highlightedGame = gameId;
    },

    setActiveWallpaper(wallpaper) {
      this.activeWallpaper = wallpaper;
    },

    clearActiveWallpaper() {
      this.activeWallpaper = {};
    },

    setActiveTagIndex(index) {
      this.activeTagIndex = index;
    },

    setActiveBoardListIndex(index) {
      this.activeBoardListIndex = index;
    },

    clearActiveBoardListIndex() {
      this.activeBoardListIndex = null;
    },

    setNotification(notification) {
      this.notification = notification;
    },
  },
});

