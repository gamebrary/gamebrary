<template lang="html">
  <b-modal
    id="previewWallpaper"
    hide-footer
    scrollable
    :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
    size="xl"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="wallpaper.name"
        @close="close"
      >
        <b-dropdown
          :variant="darkTheme ? 'black' : 'light'"
          no-caret
          right
        >
          <template #button-content>
            <b-spinner v-if="saving || deleting" small />
            <i v-else class="fas fa-ellipsis-h" aria-hidden="true" />
          </template>

          <b-dropdown-item v-b-modal.setAsWallpaper>Set as wallpaper</b-dropdown-item>

          <b-modal
            id="setAsWallpaper"
            size="lg"
            :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
            :header-text-variant="darkTheme ? 'white' : 'dark'"
            :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
            :body-text-variant="darkTheme ? 'white' : 'dark'"
          >
            <template v-slot:modal-header="{ close }">
              <modal-header
                  title="Apply wallpaper to board"
                  @close="close"
              />
            </template>

            <div class="board-grid mx-2">
              <mini-board
                v-for="board in formattedBoards"
                :key="board.id"
                :board="board"
                @click.native="setAsWallpaper(board)"
              />
            </div>
          </b-modal>

          <b-dropdown-divider />
          <b-dropdown-item
            variant="danger"
            v-b-modal.deleteConfirm
          >
              Delete wallpaper
          </b-dropdown-item>
        </b-dropdown>

        <b-modal
          id="deleteConfirm"
          :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
          :header-text-variant="darkTheme ? 'white' : 'dark'"
          :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
          :body-text-variant="darkTheme ? 'white' : 'dark'"
          hide-footer
        >
          <template v-slot:modal-header="{ close }">
            <modal-header
              title="Are you sure?"
              @close="close"
            />
          </template>

          <p>Wallpaper will be permanently removed</p>

          <b-alert v-if="boardsWithWallpaper.length" show variant="warning">
            This wallpaper is being used by {{ boardsWithWallpaper.length }} boards.
          </b-alert>

          <b-button @click="deleteFile(wallpaper)" variant="danger">
            <b-spinner v-if="deleting" small />
            <template v-else>Delete</template>
          </b-button>
        </b-modal>
      </modal-header>
    </template>

    <b-img
      v-if="wallpaper.url"
      :src="wallpaper.url"
      class="mw-100 rounded"
    />
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';

export default {
  data() {
    return {
      saving: false,
      deleting: false,
    };
  },

  components: {
    MiniBoard,
  },

  props: {
    wallpaper: {
      type: [Object, Boolean],
      default: () => {},
    },
  },

  computed: {
    ...mapState(['boards', 'wallpapers']),
    ...mapGetters(['darkTheme']),

    formattedBoards() {
      return this.boards.map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board.backgroundUrl) }));
    },

    wallpaperUrl() {
      return this.wallpaper?.url;
    },

    boardsWithWallpaper() {
      return this.boards.filter(({ backgroundUrl }) => backgroundUrl === this.wallpaper?.fullPath) || [];
    },
  },

  methods: {
    getWallpaperUrl(url) {
      if (!url) return null;
      if (url?.includes('igdb.com')) return url;

      return this.wallpapers?.find(({ ref }) => ref === url)?.url;
    },

    async deleteFile(file) {
      this.deleting = true;

      await this.$store.dispatch('DELETE_WALLPAPER', file)
        .catch(() => {
          this.$bvToast.toast('There was an error deleting wallpaper', { variant: 'danger' });
        });

      this.deleting = false;
      this.$bvModal.hide('previewWallpaper');
    },

    async setAsWallpaper(board) {
      try {
        this.saving = true;

        this.$store.commit('SET_ACTIVE_BOARD', { ...board, backgroundUrl: this.wallpaper.fullPath });

        await this.$store.dispatch('SAVE_BOARD');
      } catch (e) {
        this.saving = false;
      }

      this.saving = false;
      this.$bvModal.hide('previewWallpaper');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.board-thumbnail {
  background-size: cover;
  background-position: center;
}
</style>
