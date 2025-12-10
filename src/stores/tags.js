import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [],
  }),

  persist: {
    paths: ['tags'],
  },

  actions: {
    async loadTags(userId) {
      const docSnap = await getDoc(doc(db, 'tags', userId));
      const tagsData = docSnap.data();

      if (!tagsData) return;

      const { tags } = docSnap.data();
      const formattedTags = Object.entries(tags).map(([, tag]) => ({ ...tag }));
      this.tags = formattedTags;
    },

    async saveTags(userId) {
      await setDoc(doc(db, 'tags', userId), { tags: this.tags }, { merge: false });
    },

    setTags(tags) {
      this.tags = tags;
    },

    createTag(tag) {
      this.tags.push(tag);
    },

    updateTag(tagIndex, tag) {
      this.tags[tagIndex] = JSON.parse(JSON.stringify(tag));
    },

    removeTag(tagIndex) {
      this.tags.splice(tagIndex, 1);
    },

    applyTagToGame(tagIndex, gameId) {
      this.tags[tagIndex].games.push(gameId);
    },

    removeGameFromTag(tagIndex, gameId) {
      const gameIndex = this.tags[tagIndex].games.indexOf(gameId);
      if (gameIndex !== -1) {
        this.tags[tagIndex].games.splice(gameIndex, 1);
      }
    },
  },
});

