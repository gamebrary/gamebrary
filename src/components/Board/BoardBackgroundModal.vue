<template lang="html">
  <b-modal
    id="boardBackground"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    hide-footer
    scrollable
    @hide="hide"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Board background"
        subtitle="Edit board"
        @close="close"
      >
        <b-button
          variant="primary"
          :disabled="saving"
          @click="saveSettings"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </modal-header>
    </template>

    <b-row class="mb-3">
      <b-col cols="12" sm="6">
        <b-form-group
          label="Board background color"
          class="m-0"
        />

        <div class="d-flex">
          <b-form-input
            style="max-width: 90px"
            v-model="backgroundColor"
            class="mr-2"
          />

          <b-form-input
            style="width: 40px;"
            id="backgroundColor"
            class="color-picker"
            placeholder="Hex value"
            v-model="backgroundColor"
            type="color"
          />
        </div>

        <b-button
          v-if="localWallpaper"
          class="mt-2"
          variant="danger"
          @click="removeWallpaper"
        >
          <i class="fas fa-trash fa-fw" aria-hidden /> Remove image
        </b-button>
      </b-col>

      <b-col class="mt-3 mt-sm-0" cols="12" sm="6">
        Preview

        <mini-board
          :board="board"
          :background-image="wallpaperUrl"
        />
      </b-col>
    </b-row>

    <h6>My Wallpapers</h6>
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
  </b-modal>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import WallpapersList from '@/components/WallpapersList';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    WallpapersList,
  },

  data() {
    return {
      backgroundColor: null,
      localWallpaper: null,
      wallpaperUrl: null,
      loading: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['board', 'wallpapers']),
    ...mapGetters(['nightMode']),
  },

  async mounted() {
    this.$bus.$on('WALLPAPER_UPLOADED', this.loadWallpapers);

    const { board } = this;

    this.localWallpaper = board.wallpaper;

    if (this.localWallpaper) {
      this.wallpaperUrl = await this.$store.dispatch('LOAD_WALLPAPER', this.localWallpaper);
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

    removeWallpaper() {
      this.localWallpaper = null;
      this.wallpaperUrl = null;
    },

    async setWallpaper({ fullPath }) {
      this.localWallpaper = fullPath;
      this.wallpaperUrl = await this.$store.dispatch('LOAD_WALLPAPER', fullPath);
      this.$bus.$emit('RELOAD_WALLPAPER');
    },

    async saveSettings() {
      this.saving = true;
      const wallpaperChanged = this.board.wallpaper !== this.localWallpaper;

      const { board } = this;

      const payload = {
        ...board,
        backgroundColor: this.backgroundColor,
        wallpaper: this.localWallpaper,
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('<CHANGE>ME</CHANGE>Board settings saved');
      this.$bvModal.hide('boardBackground');

      if (wallpaperChanged) {
        this.$bus.$emit('RELOAD_WALLPAPER');
      }
    },
  },
};
</script>
