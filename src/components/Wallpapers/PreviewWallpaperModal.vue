<template lang="html">
  <b-modal
    id="previewWallpaper"
    hide-footer
    scrollable
    size="xl"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Wallpaper"
        :subtitle="wallpaper.name"
        @close="close"
      >
        <b-dropdown
          variant="light"
          class="mr-2"
          menu-class="p-0"
        >
          <template #button-content>
            <b-spinner v-if="saving" small />
            <span v-else>Set as wallpaper</span>
          </template>

          <b-dropdown-item
            v-for="board in formattedBoards"
            :key="board.id"
            @click="setAsWallpaper(board)"
            class="p-0"
          >
            <b-avatar
              rounded
              :class="['board-thumbnail mr-2', { 'bg-dark' : !board.backgroundColor }]"
              :title="board.name"
              text=" "
              size="32"
              :style="`
                background-image: url(${board.backgroundUrl ? board.backgroundUrl : ''});
                background-color: ${board.backgroundColor ? board.backgroundColor : ''}
                `"
            />

            {{ board.name }}
          </b-dropdown-item>
        </b-dropdown>

        <b-button
          variant="danger"
          @click.stop="confirmDeleteWallpaper(wallpaper)"
        >
          <b-spinner v-if="deleting" small />
          <i v-else class="fas fa-trash fa-fw" aria-hidden />
        </b-button>
      </modal-header>
    </template>

    <b-img
      v-if="wallpaperUrl"
      :src="wallpaperUrl"
      class="w-100 rounded"
    />
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';
// import { bytesToSize } from '@/utils';

export default {
  data() {
    return {
      saving: false,
      deleting: false,
    };
  },
  props: {
    wallpaper: {
      type: [Object, Boolean],
      default: () => {},
    },
  },

  computed: {
    ...mapState(['boards', 'wallpapers']),

    formattedBoards() {
      return this.boards.map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board.backgroundUrl) }));
    },

    wallpaperUrl() {
      return this.wallpaper?.url;
    },
  },

  methods: {
    // formatSize(wallpaper) {
    //   return bytesToSize(wallpaper?.metadata?.size || 0);
    // },

    getWallpaperUrl(url) {
      if (!url) return null;
      if (url?.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers?.find(({ fullPath }) => fullPath === url);

      return wallpaper?.url;
    },

    async confirmDeleteWallpaper(file) {
      const confirmed = await this.$bvModal.msgBoxConfirm('Wallpaper will be permanently removed', {
        okVariant: 'danger',
        okTitle: 'Delete',
      });

      if (confirmed) {
        this.deleteFile(file);
      }
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
      const payload = {
        ...board,
        backgroundUrl: this.wallpaper.fullPath,
      }
      this.saving = true;

      this.$store.commit('SET_ACTIVE_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;
        });

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
