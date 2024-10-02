<template lang="html">
  <b-sidebar
    id="wallpaper-details-sidebar"
    v-bind="sidebarRightProps"
    :visible="visible"
    @hidden="closeSidebar"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide" title="Filter search results" />

      <div
        class="px-3"
      >
        <a :href="wallpaperUrl" target="_blank">
          <b-img
            v-if="wallpaperUrl"
            :src="wallpaperUrl"
            class="mw-100 rounded mb-2"
          />
        </a>

        <div class="d-flex align-items-center justify-content-between pb-2">
          <a :href="wallpaperUrl" target="_blank" class="text-truncate">
            {{ activeWallpaper.name }}
          </a>

          <b-button
            v-b-modal.deleteConfirm
            variant="danger"
            class="ml-2"
            v-b-tooltip.hover="{ title: 'Delete wallpaper', placement: 'bottom', boundary: 'viewports' }"
          >
            <i class="fa fa-trash" aria-hidden="true" />
          </b-button>
        </div>

        <b-button
          v-b-toggle.boards-list
          title=""
          v-bind="buttonProps"
          v-b-tooltip.hover.bottom
        >
          Set as wallpaper
        </b-button>
      </div>

      <b-collapse id="boards-list">
        <div
          style="position: sticky; top: 0; z-index: 3;"
          :class="darkTheme ? 'bg-dark' : 'bg-light'"
          class="pt-3 pb-1"
        >
          <b-alert
            show
            variant="success"
          >
            Select a board to apply wallpaper
          </b-alert>
        </div>

        <MiniBoard
          v-for="board in formattedBoards"
          :key="board.id"
          :board="board"
          no-link
          @click.native="setAsBoardWallpaper(board)"
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

        <b-button @click="deleteFile(activeWallpaper)" variant="danger">
          <b-spinner v-if="deleting" small />
          <template v-else>Delete</template>
        </b-button>
      </b-modal>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';

export default {
  data() {
    return {
      saving: false,
      deleting: false,
    };
  },

  components: {
    MiniBoard,
    SidebarHeader,
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'activeWallpaper']),
    ...mapGetters(['darkTheme', 'sidebarRightProps', 'buttonProps']),

    formattedBoards() {
      return this.boards.map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board.backgroundUrl) }));
    },

    wallpaperUrl() {
      return this.activeWallpaper?.url;
    },

    boardsWithWallpaper() {
      return this.boards.filter(({ backgroundUrl }) => backgroundUrl && backgroundUrl === this.activeWallpaper?.fullPath) || [];
    },

    visible() {
      return Boolean(this.activeWallpaper?.fullPath);
    },
  },

  methods: {
    closeSidebar() {
      this.$store.commit('CLEAR_ACTIVE_WALLPAPER');
      this.saving = false;
      this.deleting = false;
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

      this.$bvModal.hide('deleteConfirm');
      this.$root.$emit('bv::toggle::collapse', 'wallpaper-details-sidebar');
    },

    async setAsBoardWallpaper(board) {
      try {
        this.saving = true;

        this.$store.commit('SET_ACTIVE_BOARD', { ...board, backgroundUrl: this.activeWallpaper.fullPath });

        await this.$store.dispatch('SAVE_BOARD');
        this.$store.commit('CLEAR_ACTIVE_WALLPAPER');

        this.$router.push({ name: 'board', params: { id: board.id } });
      } catch (e) {
        this.saving = false;
      }
    },
  },
};
</script>
