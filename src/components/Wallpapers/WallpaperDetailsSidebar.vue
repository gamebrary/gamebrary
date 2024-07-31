<template lang="html">
  <b-sidebar
    id="wallpaper-details-sidebar"
    scrollable
    right
    width="380px"
    shadow
    :visible="visible"
    no-header
    backdrop
    body-class="px-3 pb-3"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    @hidden="closeSidebar"
  >
    <div
      class="active-wallpaper pt-3"
      :class="darkTheme ? 'bg-dark' : 'bg-light'"
    >
      <b-img
        v-if="activeWallpaper.url"
        :src="activeWallpaper.url"
        class="mw-100 rounded mb-2"
      />

      <div class="d-flex align-items-center justify-content-between pb-2">
        <div>
          <i class="fa-solid fa-file-png fa-fw" />
          {{ activeWallpaper.name }}
          <!-- {{ activeWallpaper.size }} -->
        <!-- {{ activeWallpaper.timeCreated }} -->
        </div>

        <b-dropdown id="wallpaperOptions">
          <b-dropdown-item v-b-toggle.boards-list>
            Set as wallpaper
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item v-b-modal.deleteConfirm variant="danger">
            Delete wallpaper
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

  
    <b-collapse id="boards-list" class="mt-2">
      <MiniBoard
        v-for="board in formattedBoards"
        :key="board.id"
        :board="board"
        @click.native="setAsWallpaper(board)"
      />
    </b-collapse>

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
  </b-sidebar>
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
    ...mapState(['boards', 'wallpapers', 'activeWallpaper']),
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

    visible() {
      return Boolean(this.activeWallpaper?.fullPath);
    },
  },

  methods: {
    closeSidebar() {
      this.$store.commit('CLEAR_ACTIVE_WALLPAPER');
    },

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
      this.$bvModal.hide('wallpaper-details-sidebar');
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
      this.$bvModal.hide('wallpaper-details-sidebar');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.active-wallpaper {
  position: sticky;
  top: 0;
  z-index: 9999;
}
</style>
