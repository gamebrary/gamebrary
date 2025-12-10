import { defineStore } from 'pinia';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
import { FIREBASE_CONFIG } from '@/constants';
import { initializeApp } from 'firebase/app';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    sessionExpired: false,
  }),

  persist: {
    paths: ['user'],
  },

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },

  actions: {
    setUser(userData) {
      this.user = {
        lastLogin: userData.metadata.lastSignInTime,
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        emailVerified: userData.emailVerified,
        dateJoined: userData.metadata.creationTime,
        photoURL: userData.photoURL,
        providerId: userData.providerData?.[0]?.providerId,
      };
    },

    setSessionExpired(expired) {
      this.sessionExpired = expired;
    },

    async signOut() {
      await signOut(auth);
    },

    async deleteAccount() {
      const user = auth.currentUser;
      const userStore = this;

      try {
        // Import other stores to access their state
        const { useBoardsStore } = await import('./boards');
        const { useWallpapersStore } = await import('./wallpapers');
        const boardsStore = useBoardsStore();
        const wallpapersStore = useWallpapersStore();

        await deleteDoc(doc(db, 'games', userStore.user.uid));
        await deleteDoc(doc(db, 'notes', userStore.user.uid));
        await deleteDoc(doc(db, 'tags', userStore.user.uid));
        await deleteDoc(doc(db, 'progresses', userStore.user.uid));
        await deleteDoc(doc(db, 'profiles', userStore.user.uid));
        await deleteDoc(doc(db, 'settings', userStore.user.uid));

        if (boardsStore.boards.length > 0) {
          for (const { id } of boardsStore.boards) {
            await deleteDoc(doc(db, 'boards', id));
          }
        }

        if (wallpapersStore.wallpapers.length > 0) {
          for (const { fullPath } of wallpapersStore.wallpapers) {
            await deleteObject(ref(storage, fullPath));
          }
        }

        const avatarsRef = ref(storage, `${userStore.user.uid}/avatars`);
        const { items } = await listAll(avatarsRef);
        for (const { fullPath } of items) {
          await deleteObject(ref(storage, fullPath));
        }

        await deleteUser(user);
        this.clearSession();
      } catch (error) {
        this.setSessionExpired(true);
        throw error;
      }
    },

    clearSession() {
      this.user = null;
      this.sessionExpired = false;
    },
  },
});

