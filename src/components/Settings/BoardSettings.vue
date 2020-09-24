<template lang="html">
  <b-button
    v-b-modal:board-settings
    v-b-tooltip.hover.left
    title="Board settings"
    class="mt-3"
    ref="addList"
  >
    <b-icon-gear-fill />

    <b-modal
      id="board-settings"
      title="Board settings"
      size="lg"
      @show="init"
      @hide="hide"
    >
      <form ref="boardSettingsForm" @submit.stop.prevent="submit">
        <b-form-group
          label="Board name"
          label-for="name"
        >
          <b-form-input
            id="name"
            v-model="name"
            required
          />
        </b-form-group>

        <b-form-group
          label="Board description"
          label-for="description"
        >
          <b-form-textarea
            id="description"
            v-model="description"
            maxlength="280"
            rows="3"
          />
        </b-form-group>

        <!-- <b-form-group
          label="Board theme"
          label-for="theme"
        >
          <b-form-select
            id="theme"
            disabled
            v-model="theme"
          >
            <b-form-select-option
              v-for="{ id, name } in themes"
              :key="id"
              :value="id"
            >
              {{ name }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group> -->

        <b-form-group
          v-if="wallpapers.length"
          label="Board wallpaper"
          label-for="wallpaper"
        >
          <b-dropdown
            id="wallpaper"
            text="Select wallpaper"
            boundary="viewport"
          >
            <b-dropdown-item
              variant="danger"
              v-if="wallpaper"
              @click="removeWallpaper"
            >
              Remove wallpaper
            </b-dropdown-item>

            <b-dropdown-item
              variant="primary"
              v-b-modal:wallpapers
            >
              Upload wallpaper
            </b-dropdown-item>

            <b-dropdown-item
              v-for="file in wallpapers"
              :key="file.name"
              @click="setWallpaper(file.fullPath)"
            >
              <b-img
                thumbnail
                :src="file.url"
                :alt="file.name"
                fluid
              />
            </b-dropdown-item>
          </b-dropdown>
        </b-form-group>

        <div v-else>
          No wallpapers uploaded yet.
          <b-button v-b-modal:wallpapers>Manage files</b-button>
        </div>


        <b-img
          v-if="wallpaper && wallpaperUrl"
          thumbnail
          class="mb-3"
          :src="wallpaperUrl"
          fluid
        />

        <b-button v-b-toggle.platforms>Change board platforms</b-button>

        <b-collapse id="platforms" class="mt-2">
          <platform-picker v-model="board.platforms" />
        </b-collapse>
      </form>

      <template v-slot:modal-footer>
        <b-button
          variant="danger"
          @click="confirmDelete"
        >
          Delete board
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving"
          @click="saveSettings"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Save</span>
        </b-button>
      </template>
    </b-modal>
  </b-button>
</template>

<script>
import { mapState } from 'vuex';
import PlatformPicker from '@/components/Board/PlatformPicker';

export default {
  components: {
    PlatformPicker,
  },

  data() {
    return {
      saving: false,
      description: null,
      name: null,
      platforms: null,
      theme: null,
      wallpaper: null,
      wallpaperUrl: null,
    };
  },

  computed: {
    ...mapState(['board', 'user', 'wallpapers']),
  },

  methods: {
    hide() {
      this.$bus.$off('WALLPAPER_UPLOADED', this.loadWallpapers);
    },

    async loadWallpapers() {
      await this.$store.dispatch('LOAD_WALLPAPERS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading wallpapers', { title: 'Error', variant: 'danger' });
        });
    },

    removeWallpaper() {
      this.wallpaper = null;
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
          this.$bvToast.toast('There was an error deleting board', { title: 'Error', variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed', { title: 'Success', variant: 'success' });
      this.$router.push({ name: 'home' });
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
        theme: this.theme,
        wallpaper: this.wallpaper,
      };

      this.$store.commit('SET_BOARD', payload);

      if (board.name !== this.name) {
        this.$store.commit('UPDATE_BOARD_NAME', payload);
      }

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', { title: 'Error', variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('Board settings saved', { title: 'Saved', variant: 'success' });
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
</style>
