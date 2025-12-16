import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, getDocs, deleteDoc, limit, startAfter } from 'firebase/firestore';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 20;

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: {},
    cachedGames: {},
    gamesSortOrder: { sortBy: 'name', sortOrder: 'asc', gameIds: [] },
    game: {},
    platforms: [],
    // Pagination state
    gamesLastDoc: null,
    gamesHasMore: true,
    currentPage: 1,
    pageCursors: {}, // Store cursors for each page: { pageNumber: lastDoc }
    totalGamesLoaded: 0,
  }),

  persist: {
    paths: ['games', 'cachedGames', 'gamesSortOrder'],
  },

  getters: {
    gameCount: (state) => Object.keys(state.games).length,
  },

  actions: {
    async loadGames(userId) {
      const docSnap = await getDoc(doc(db, 'games', userId));
      this.games = docSnap.data() || {};
    },

    async loadGamesSorted(userId, twitchToken, { sortBy = 'name', sortOrder = 'asc', pageSize = DEFAULT_PAGE_SIZE, reset = false, lastDoc = null } = {}) {
      try {
        const userGamesRef = collection(db, 'games', userId, 'userGames');
        const sortFieldMap = {
          name: 'name',
          progress: 'progress',
          tags: 'tagCount',
          dateAdded: 'dateAdded',
        };

        const field = sortFieldMap[sortBy] || 'name';

        // Reset pagination state if requested or if sort changed
        if (reset || this.gamesSortOrder.sortBy !== sortBy || this.gamesSortOrder.sortOrder !== sortOrder) {
          this.games = {};
          this.gamesLastDoc = null;
          this.gamesHasMore = true;
          this.currentPage = 1;
          this.pageCursors = {};
          this.totalGamesLoaded = 0;
        }

        // Build query constraints
        const constraints = [
          orderBy(field, sortOrder),
          limit(pageSize)
        ];

        // Add startAfter if we have a last document (for pagination)
        const cursorDoc = lastDoc || this.gamesLastDoc;
        if (cursorDoc) {
          constraints.push(startAfter(cursorDoc));
        }

        // Build query with all constraints
        const q = query(userGamesRef, ...constraints);

        const querySnapshot = await getDocs(q);
        const games = {};
        const gameIds = [];

        querySnapshot.forEach((docSnap) => {
          const gameId = docSnap.id;
          games[gameId] = true;
          gameIds.push(gameId);
        });

        if (gameIds.length === 0) {
          const docSnap = await getDoc(doc(db, 'games', userId));
          const gamesData = docSnap.data() || {};
          const likedGameIds = Object.keys(gamesData).filter(id => gamesData[id]);

          if (likedGameIds.length > 0) {
            for (const gameId of likedGameIds) {
              await this.saveUserGame(userId, {
                gameId,
                gameData: this.cachedGames[gameId],
              });
            }
            return this.loadGamesSorted(userId, twitchToken, { sortBy, sortOrder, pageSize, reset });
          }
        }

        // For pagination, replace games if reset, otherwise merge
        if (reset) {
          this.games = games;
          this.totalGamesLoaded = gameIds.length;
        } else {
          this.games = { ...this.games, ...games };
          this.totalGamesLoaded += gameIds.length;
        }

        this.gamesHasMore = querySnapshot.docs.length === pageSize;

        // Store last document for next page and current page cursor
        if (querySnapshot.docs.length > 0) {
          const lastDocSnap = querySnapshot.docs[querySnapshot.docs.length - 1];
          this.gamesLastDoc = lastDocSnap;
          // Store cursor for current page
          if (!reset) {
            this.pageCursors[this.currentPage] = lastDocSnap;
          }
        } else {
          this.gamesHasMore = false;
        }

        // Update gameIds list
        const allGameIds = reset ? gameIds : [...(this.gamesSortOrder.gameIds || []), ...gameIds];
        this.gamesSortOrder = { sortBy, sortOrder, gameIds: allGameIds };

        return {
          gameIds,
          hasMore: this.gamesHasMore,
          lastDoc: this.gamesLastDoc,
          currentPage: this.currentPage,
          totalGamesLoaded: this.totalGamesLoaded,
        };
      } catch (e) {
        console.warn('Failed to load sorted games, falling back to regular load:', e);
        const docSnap = await getDoc(doc(db, 'games', userId));
        this.games = docSnap.data() || {};
        this.gamesHasMore = false;
        return {
          gameIds: [],
          hasMore: false,
          lastDoc: null,
        };
      }
    },

    async saveGames(userId) {
      await setDoc(doc(db, 'games', userId), this.games);
    },

    async saveUserGame(userId, { gameId, gameData }) {
      const userGameRef = doc(db, 'games', userId, 'userGames', String(gameId));
      const { useProgressesStore } = await import('./progresses');
      const { useTagsStore } = await import('./tags');
      const progressesStore = useProgressesStore();
      const tagsStore = useTagsStore();

      const game = this.cachedGames?.[gameId] || gameData;
      const progress = progressesStore.progresses?.[gameId] || 0;
      const tags = tagsStore.tags || [];
      const gameTags = tags.filter(tag => tag?.games?.includes(Number(gameId)));

      await setDoc(userGameRef, {
        name: game?.name || '',
        progress: progress,
        tagCount: gameTags.length,
        dateAdded: Date.now(),
        gameId: Number(gameId),
      }, { merge: true });
    },

    async deleteUserGame(userId, gameId) {
      const userGameRef = doc(db, 'games', userId, 'userGames', String(gameId));
      await deleteDoc(userGameRef);
    },

    likeGame(gameId) {
      this.games[gameId] = true;
    },

    unlikeGame(gameId) {
      this.games[gameId] = false;
    },

    setGames(games) {
      this.games = games;
    },

    setGamesSortOrder(sortOrder) {
      this.gamesSortOrder = sortOrder;
    },

    setCurrentPage(page) {
      this.currentPage = page;
    },

    getPageCursor(page) {
      return this.pageCursors[page] || null;
    },

    setPageCursor(page, cursor) {
      this.pageCursors[page] = cursor;
    },

    cacheGameData(games) {
      games.forEach((game) => {
        this.cachedGames[game.id] = { ...game };
      });
    },

    clearCacheGameData() {
      this.cachedGames = {};
    },

    async loadIGDBGames(twitchToken, gameIds) {
      const data = `fields id,name,platforms,slug,rating,release_dates.*,name,cover.image_id; where id = (${gameIds}); limit 500;`;
      const response = await axios.get(`${API_BASE}/igdb?token=${twitchToken.access_token}&path=games&data=${data}`);
      this.cacheGameData(response.data);
      return response.data;
    },

    async queryIGDB({ path, data }) {
      const { useTwitchStore } = await import('./twitch');
      const twitchStore = useTwitchStore();
      if (!twitchStore.twitchToken) {
        await twitchStore.getTwitchToken();
      }
      const response = await axios.get(`${API_BASE}/igdb?token=${twitchStore.twitchToken.access_token}&path=${path}&data=${data}`);
      this.cacheGameData(response.data);
      return response.data;
    },

    setGame(game) {
      this.game = game;
    },

    clearGame() {
      this.game = null;
    },

    appendSteamGameData(data) {
      this.game.steam = data;
    },

    appendGameNews(news) {
      this.game.news = news;
    },

    async loadSteamGameNews(steamAppId) {
      const { useTwitchStore } = await import('./twitch');
      const twitchStore = useTwitchStore();
      if (!twitchStore.twitchToken) {
        await twitchStore.getTwitchToken();
      }
      const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
      const response = await axios.get(`${API_BASE}/steam-news?token=${twitchStore.twitchToken.access_token}&appid=${steamAppId}`);
      const news = response.data?.appnews?.newsitems || [];
      this.appendGameNews(news);
      return news;
    },

    appendWikipediaGameData(data) {
      this.game.wikipedia = data;
    },

    appendGameSpeedruns({ data }) {
      this.game.speedruns = data;
    },

    appendGameSpeedrunId(speedrunId) {
      if (this.game !== null) {
        this.game.speedrunId = speedrunId;
      }
    },

    appendGogGameData(data) {
      this.game.gog = data;
    },

    async loadSteamGame(steamGameId) {
      const { useTwitchStore } = await import('./twitch');
      const twitchStore = useTwitchStore();
      if (!twitchStore.twitchToken) {
        await twitchStore.getTwitchToken();
      }
      const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
      const response = await axios.get(`${API_BASE}/steam-game?token=${twitchStore.twitchToken.access_token}&gameId=${steamGameId}`);
      const gameData = response.data?.[steamGameId]?.data;
      if (gameData) {
        this.appendSteamGameData(gameData);
      }
      return gameData;
    },

    async loadGogGame(gameName) {
      const { useTwitchStore } = await import('./twitch');
      const twitchStore = useTwitchStore();
      if (!twitchStore.twitchToken) {
        await twitchStore.getTwitchToken();
      }
      const API_BASE = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';
      try {
        const response = await axios.get(`${API_BASE}/gog-game?token=${twitchStore.twitchToken.access_token}&gameName=${encodeURIComponent(gameName)}`);
        if (response.data) {
          this.appendGogGameData(response.data);
        }
        return response.data;
      } catch (e) {
        console.error('Error loading GOG game:', e);
        return null;
      }
    },

    async loadWikipediaDescription(wikipediaSlug) {
      try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikipediaSlug)}`);
        if (response.data) {
          this.appendWikipediaGameData(response.data);
        }
        return response.data;
      } catch (e) {
        console.error('Error loading Wikipedia description:', e);
        return null;
      }
    },

    setPlatforms(platforms) {
      this.platforms = platforms;
    },

    async getSpeedrunGameId(gameName) {
      try {
        const { data } = await axios.get(`https://www.speedrun.com/api/v1/games?name=${gameName}`);
        const speedRunGameId = data?.data?.[0]?.id;

        if (speedRunGameId) {
          this.appendGameSpeedrunId(speedRunGameId);
          await this.loadGameSpeedrunRuns(speedRunGameId);
          return { data: data.data };
        }
      } catch (error) {
        throw error;
      }
    },

    async loadGameSpeedrunRuns(gameId) {
      try {
        const { data } = await axios.get(`https://www.speedrun.com/api/v1/runs?game=${gameId}`);
        this.appendGameSpeedruns({ data });
        return data;
      } catch (error) {
        throw error;
      }
    },
  },
});

