import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const useProgressesStore = defineStore('progresses', {
  state: () => ({
    progresses: {},
  }),

  persist: {
    paths: ['progresses'],
  },

  actions: {
    async loadProgresses(userId) {
      const docSnap = await getDoc(doc(db, 'progresses', userId));
      this.progresses = docSnap.data() || {};
    },

    async saveProgresses(userId) {
      await setDoc(doc(db, 'progresses', userId), this.progresses, { merge: true });

      // Update userGames subcollection for games that are liked
      const { useGamesStore } = await import('./games');
      const gamesStore = useGamesStore();
      const likedGameIds = Object.keys(gamesStore.games).filter(id => gamesStore.games[id]);

      for (const gameId of likedGameIds) {
        if (this.progresses[gameId] !== undefined) {
          await gamesStore.saveUserGame(userId, {
            gameId,
            gameData: gamesStore.cachedGames[gameId],
          });
        }
      }
    },

    async saveProgressesNoMerge(userId) {
      await setDoc(doc(db, 'progresses', userId), this.progresses, { merge: false });
    },

    setProgresses(progresses) {
      this.progresses = progresses;
    },

    setGameProgress({ progress, gameId }) {
      this.progresses[gameId] = progress;
    },

    removeGameProgress(gameId) {
      if (this.progresses[gameId]) {
        delete this.progresses[gameId];
      }
    },
  },
});

