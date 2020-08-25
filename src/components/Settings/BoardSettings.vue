<template lang="html">
  <b-button
    v-b-modal:board-settings
    class="mt-3"
    ref="addList"
  >
    <b-icon-gear-fill />

    <b-modal
      id="board-settings"
      title="Board settings"
      scrollable
      @show="init"
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
          label="Board descriptiopn"
          label-for="description"
        >
          <b-form-textarea
            id="description"
            v-model="description"
            maxlength="280"
            rows="3"
          />
        </b-form-group>

        <b-form-group
          label="Board theme"
          label-for="theme"
        >
          <b-form-select
            id="theme"
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
        </b-form-group>

        <b-form-group
          label="Board wallpaper"
          label-for="wallpaper"
        >
          <b-dropdown
            v-if="wallpapers.length"
            id="wallpaper"
            text="Select wallpaper"
            boundary="viewport"
            class="m-md-2"
          >
            <b-dropdown-item variant="danger" v-if="wallpaper" @click="removeWallpaper">
              Remove wallpaper
            </b-dropdown-item>
            <b-dropdown-item
              v-for="file in wallpapers"
              :key="file.name"
              @click="setWallpaper(file)"
            >
              <b-img
                thumbnail
                width="200px"
                :src="file.url"
                :alt="file.name"
                fluid
              />
            </b-dropdown-item>
          </b-dropdown>
        </b-form-group>

        <b-img
          v-if="wallpaper"
          thumbnail
          width="200px"
          :src="wallpaperUrl"
          fluid
        />

        <platform-picker
          v-model="board.platforms"
        />
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
import themes from '@/themes';
import PlatformPicker from '@/components/Board/PlatformPicker';

export default {
  components: {
    PlatformPicker,
  },

  data() {
    return {
      themes,
      saving: false,
      description: null,
      name: null,
      platforms: null,
      theme: null,
      wallpaper: null,
      wallpaperUrl: null,
      wallpapers: [],
    };
  },

  computed: {
    ...mapState(['board', 'user']),
  },

  methods: {
    async loadWallpapers() {
      this.wallpapers = [];

      const files = await this.$store.dispatch('LOAD_WALLPAPERS');

      // TODO: use promise all instead
      files.forEach(async (path) => {
        const url = await this.$store.dispatch('LOAD_FIRESTORE_FILE', path);

        const name = path.split(`${this.user.uid}/wallpapers/`)[1];

        this.wallpapers.push({ name, url, path });
      });
    },

    removeWallpaper() {
      this.wallpaper = null;
      this.wallpaperUrl = null;
    },

    async setWallpaper(file) {
      this.wallpaper = file.path;

      this.wallpaperUrl = await this.$store.dispatch('LOAD_FIRESTORE_FILE', file.path);
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.createBoardForm.checkValidity()) {
        this.createBoard();
      }
    },

    async init() {
      const { board } = this;

      this.description = board.description;
      this.name = board.name;
      this.platforms = board.platforms;
      this.theme = board.theme || 'default';
      this.wallpaper = board.wallpaper;
      this.wallpaperUrl = board.wallpaper
        ? await this.$store.dispatch('LOAD_FIRESTORE_FILE', board.wallpaper)
        : null;

      this.loadWallpapers();
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
