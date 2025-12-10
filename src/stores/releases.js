import { defineStore } from 'pinia';
import axios from 'axios';

export const useReleasesStore = defineStore('releases', {
  state: () => ({
    releases: [],
  }),

  getters: {
    latestRelease: (state) => state.releases?.[0]?.tag_name || 'v1',
  },

  actions: {
    async loadReleases() {
      try {
        const { data } = await axios.get('https://api.github.com/repos/romancm/gamebrary/releases');
        this.releases = data;
        return data;
      } catch (error) {
        throw error;
      }
    },

    setReleases(releases) {
      this.releases = releases;
    },
  },
});

