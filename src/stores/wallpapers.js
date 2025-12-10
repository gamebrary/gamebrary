import { defineStore } from 'pinia';
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytes, deleteObject } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const storage = getStorage();

export const useWallpapersStore = defineStore('wallpapers', {
  state: () => ({
    wallpapers: [],
  }),

  actions: {
    async loadWallpapers(userId) {
      return new Promise((resolve, reject) => {
        const listRef = ref(storage, `${userId}/wallpapers`);
        const wallpapers = [];

        listAll(listRef).then((res) => {
          if (res.items.length === 0) {
            this.wallpapers = [];
            resolve([]);
            return;
          }

          res.items.forEach((itemRef) => {
            getDownloadURL(ref(storage, itemRef.fullPath)).then((url) => {
              getMetadata(itemRef).then((metadata) => {
                wallpapers.push({ url, ...metadata });

                if (wallpapers.length === res.items.length) {
                  this.wallpapers = wallpapers;
                  resolve(wallpapers);
                }
              }).catch((error) => {
                reject(error);
              });
            });
          });
        }).catch((e) => {
          reject(e);
        });
      });
    },

    async uploadWallpaper(userId, file) {
      const storageRef = ref(storage, `${userId}/wallpapers/${file.name}`);
      const { metadata } = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(ref(storage, metadata.fullPath));

      const wallpaper = {
        url: downloadURL,
        ...metadata,
      };

      this.wallpapers.push(wallpaper);
      return wallpaper;
    },

    async deleteWallpaper({ fullPath }) {
      await deleteObject(ref(storage, fullPath));
      const wallpaperIndex = this.wallpapers.findIndex(wallpaper => wallpaper.fullPath === fullPath);
      if (wallpaperIndex !== -1) {
        this.wallpapers.splice(wallpaperIndex, 1);
      }
    },

    setWallpapers(wallpapers) {
      this.wallpapers = wallpapers;
    },

    addWallpaper(wallpaper) {
      this.wallpapers.push(wallpaper);
    },

    removeWallpaper(fullPath) {
      const wallpaperIndex = this.wallpapers.findIndex(wallpaper => wallpaper.fullPath === fullPath);
      if (wallpaperIndex !== -1) {
        this.wallpapers.splice(wallpaperIndex, 1);
      }
    },
  },
});

