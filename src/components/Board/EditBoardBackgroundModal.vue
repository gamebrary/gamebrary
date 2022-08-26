<!-- TODO: FIX this mess, auto save on selection -->
<template lang="html">
  <div>
    <b-row class="mb-3">
      <b-col cols="12" sm="6">

      </b-col>

      <b-col class="mt-3 mt-sm-0" cols="12" sm="6">
        Preview


      </b-col>
    </b-row>

    <h3>My Wallpapers</h3>
    <!-- <b-button>Upload wallpaper</b-button> -->

    <wallpapers-list
      selectable
      @selected="setWallpaper"
    />

    <b-alert :show="!wallpapers.length">
      {{ $t('board.settings.noWallpapers') }}

      <br />

      <b-button :to="{ name: 'wallpapers' }" class="mt-3">
        {{ $t('board.settings.uploadWallpaper') }}
      </b-button>
    </b-alert>
  </div>
</template>

<script>
import WallpapersList from '@/components/WallpapersList';
import { mapState } from 'vuex';

export default {
  components: {
    WallpapersList,
  },

  data() {
    return {
      backgroundColor: null,
      localBackgroundUrl: null,
      backgroundUrl: null,
      loading: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['board', 'wallpapers']),
  },

  async mounted() {
    this.$bus.$on('WALLPAPER_UPLOADED', this.loadWallpapers);

    const { board } = this;

    this.localBackgroundUrl = board.backgroundUrl;

    if (this.localBackgroundUrl) {
      this.backgroundUrl = this.localBackgroundUrl.includes('igdb.com')
        ? this.localBackgroundUrl
        : await this.$store.dispatch('LOAD_WALLPAPER', this.localBackgroundUrl);
    }

    this.backgroundColor = board.backgroundColor || null;
  },

  methods: {
    async loadWallpapers() {
      await this.$store.dispatch('LOAD_WALLPAPERS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading wallpapers', { variant: 'danger' });
        });
    },

    hide() {
      this.$bus.$off('WALLPAPER_UPLOADED', this.loadWallpapers);
    },

    async setWallpaper({ fullPath }) {
      this.localBackgroundUrl = fullPath;
      this.backgroundUrl = await this.$store.dispatch('LOAD_WALLPAPER', fullPath);
    },

    // async saveSettings() {
    //   this.saving = true;
    //   const wallpaperChanged = this.board.backgroundUrl !== this.localBackgroundUrl;
    //
    //   const payload = {
    //     ...this.board,
    //     backgroundColor: this.backgroundColor,
    //     backgroundUrl: this.localBackgroundUrl,
    //   };
    //
    //   this.$store.commit('SET_ACTIVE_BOARD', payload);
    //
    //   await this.$store.dispatch('SAVE_BOARD')
    //     .catch(() => {
    //       this.saving = false;
    //
    //       this.$bvToast.toast('There was an saving board settings', { variant: 'danger' });
    //     });
    //
    //   this.saving = false;
    //   this.$bvToast.toast('Board background saved');
    //
    // },
  },
};
</script>
