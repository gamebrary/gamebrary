import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: {},
  }),

  persist: {
    paths: ['notes'],
  },

  actions: {
    async loadNotes(userId) {
      const docSnap = await getDoc(doc(db, 'notes', userId));
      if (docSnap.data()) {
        this.notes = docSnap.data();
      }
    },

    async loadNote(noteId) {
      const docSnap = await getDoc(doc(db, 'notes-v2', noteId));
      return docSnap.data();
    },

    async saveNotes(userId) {
      await setDoc(doc(db, 'notes', userId), this.notes, { merge: true });
    },

    async saveNotesNoMerge(userId) {
      await setDoc(doc(db, 'notes', userId), this.notes, { merge: false });
    },

    setNotes(notes) {
      this.notes = notes;
    },

    setGameNote({ note, gameId }) {
      this.notes[gameId] = note;
    },

    removeGameNote(gameId) {
      if (this.notes[gameId]) {
        delete this.notes[gameId];
      }
    },

    async createNoteV2(note) {
      const docRef = await addDoc(collection(db, 'notes-v2'), note);
      return { ...note, id: docRef.id };
    },
  },
});

