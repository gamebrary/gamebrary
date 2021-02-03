<template lang="html">
  <b-modal
    id="board-settings"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    hide-footer
    @show="init"
    @hide="hide"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Edit board"
        @close="close"
      >
        <b-button
          v-b-modal.editPlatforms
          :variant="noPlatformsSelected ? 'warning' : 'secondary'"
        >
          Platforms {{ noPlatformsSelected ? null : `(${board.platforms.length})` }}
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving || noPlatformsSelected"
          @click="saveSettings"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </modal-header>
    </template>

    <form ref="boardSettingsForm" @submit.stop.prevent="submit">
      <b-form-group
        :label="$t('board.settings.nameLabel')"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="name"
          required
        />
      </b-form-group>

      <b-form-group
        :label="$t('board.settings.descriptionLabel')"
        label-for="description"
      >
        <b-form-textarea
          id="description"
          v-model="description"
          maxlength="280"
          rows="3"
        />
      </b-form-group>

      <b-form-checkbox v-model="pinned" switch>
        Pinned to dock
      </b-form-checkbox>

      <b-form-checkbox v-model="isPublic" switch>
        Make board public (beta)
      </b-form-checkbox>

      <b-alert show variant="info" v-if="isPublic" class="mt-2">
        <strong>Public Board URL</strong>
        <br>
        <small>{{ `https://app.gamebrary.com/#/b/${board.id}` }}</small>
      </b-alert>

      <b-form-group
        label="Board background color"
        label-for="backgroundColor"
      >
        <b-form-input
          id="backgroundColor"
          class="color-picker"
          v-model="backgroundColor"
          type="color"
        />

        <b-form-text
          v-if="backgroundColor"
          id="input-live-help"
        >
          {{ backgroundColor }}
        </b-form-text>
      </b-form-group>

      <b-modal
        id="editPlatforms"
        :header-bg-variant="nightMode ? 'dark' : null"
        :header-text-variant="nightMode ? 'white' : null"
        :body-bg-variant="nightMode ? 'dark' : null"
        :body-text-variant="nightMode ? 'white' : null"
        :footer-bg-variant="nightMode ? 'dark' : null"
        :footer-text-variant="nightMode ? 'white' : null"
        hide-footer
      >
        <template v-slot:modal-header="{ close }">
          <modal-header
            title="Board platforms"
            @close="close"
          />
        </template>

        <b-alert :show="noPlatformsSelected" variant="warning">
          Please select at least 1 platform
        </b-alert>

        <platform-picker v-model="board.platforms" />
      </b-modal>

      <b-form-group
        :label="$t('board.settings.wallpaper')"
        class="mb-0"
      />

      <b-dropdown
        id="wallpaper"
        v-if="wallpapers.length"
        text="Select wallpaper"
        boundary="viewport"
      >
        <b-dropdown-item
          v-for="file in wallpapers"
          :key="file.name"
          @click="setWallpaper(file.fullPath)"
        >
          <b-img
            thumbnail
            :src="file.url"
            :alt="file.name"
            width="200"
            fluid
          />
        </b-dropdown-item>
      </b-dropdown>

      <b-button
        v-if="wallpaper"
        variant="danger"
        class="mx-2"
        @click="removeWallpaper"
      >
        {{ $t('board.settings.removeWallpaper') }}
      </b-button>

      <b-alert :show="!wallpapers.length">
        {{ $t('board.settings.noWallpapers') }}

        <br />

        <b-button :to="{ name: 'wallpapers' }" class="mt-3">
          {{ $t('board.settings.uploadWallpaper') }}
        </b-button>
      </b-alert>

      <b-img
        v-if="wallpaperUrl"
        thumbnail
        class="my-3"
        :src="wallpaperUrl"
        fluid
      />

      <hr class="my-3">

      <b-button
        variant="link"
        class="text-danger px-0"
        @click="confirmDelete"
      >
        {{ $t('board.settings.deleteBoard') }}
      </b-button>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PlatformPicker from '@/components/Board/PlatformPicker';

export default {
  components: {
    PlatformPicker,
  },

  data() {
    return {
      saving: false,
      description: null,
      backgroundColor: null,
      pinned: false,
      isPublic: false,
      name: null,
      platforms: null,
      theme: null,
      wallpaper: null,
      wallpaperUrl: null,
    };
  },

  computed: {
    ...mapState(['board', 'user', 'wallpapers']),
    ...mapGetters(['nightMode']),

    noPlatformsSelected() {
      return this.board.platforms.length === 0;
    },
  },

  methods: {
    hide() {
      this.$bus.$off('WALLPAPER_UPLOADED', this.loadWallpapers);
    },

    async loadWallpapers() {
      await this.$store.dispatch('LOAD_WALLPAPERS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading wallpapers', { variant: 'danger' });
        });
    },

    removeWallpaper() {
      this.wallpaper = null;
      this.wallpaperUrl = null;
    },

    async setWallpaper(wallpaper) {
      this.wallpaper = wallpaper;
      this.wallpaperUrl = await this.$store.dispatch('LOAD_WALLPAPER', wallpaper);
      this.$bus.$emit('RELOAD_WALLPAPER');
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.boardSettingsForm.checkValidity()) {
        this.saveSettings();
      }
    },

    async init() {
      this.$bus.$on('WALLPAPER_UPLOADED', this.loadWallpapers);

      const { board } = this;

      this.description = board.description;
      this.name = board.name;
      this.platforms = board.platforms;
      this.pinned = board.pinned || false;
      this.isPublic = board.isPublic || false;
      this.backgroundColor = board.backgroundColor || null;
      this.theme = board.theme || 'default';
      this.wallpaper = board.wallpaper;

      if (this.wallpaper) {
        this.wallpaperUrl = await this.$store.dispatch('LOAD_WALLPAPER', this.wallpaper);
      }
    },

    confirmDelete() {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this board?', {
        title: 'Delete board',
        okVariant: 'danger',
        headerBgVariant: this.nightMode ? 'dark' : null,
        headerTextVariant: this.nightMode ? 'white' : null,
        bodyBgVariant: this.nightMode ? 'dark' : null,
        bodyTextVariant: this.nightMode ? 'white' : null,
        footerBgVariant: this.nightMode ? 'dark' : null,
        footerTextVariant: this.nightMode ? 'white' : null,
        okTitle: 'Yes, delete board',
      })
        .then((value) => {
          if (value) {
            this.deleteBoard();
          }
        });
    },

    async deleteBoard() {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', this.board.id)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('There was an error deleting board', { variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed');
      this.$router.push({ name: 'dashboard' });
    },

    async saveSettings() {
      this.saving = true;
      const wallpaperChanged = this.board.wallpaper !== this.wallpaper;

      const { board } = this;

      const payload = {
        ...board,
        description: this.description,
        name: this.name,
        platforms: this.platforms,
        pinned: this.pinned,
        isPublic: this.isPublic,
        backgroundColor: this.backgroundColor,
        theme: this.theme,
        wallpaper: this.wallpaper,
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);
      this.$store.commit('UPDATE_BOARDS', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('Board settings saved');
      this.$bvModal.hide('board-settings');

      if (wallpaperChanged) {
        this.$bus.$emit('RELOAD_WALLPAPER');
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.dropdown-menu {
  max-height: 400px;
  max-width: 360px;
  overflow: auto;
}

.color-picker {
  width: 38px;
}
</style>
