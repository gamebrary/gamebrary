<template lang="html">
  <b-container class="pt-3">
    <!-- TODO: allow board settings to be accessed here -->
    <template v-if="showPlaceholder">
      <b-card
        v-for="n in 3"
        :key="n"
        no-body
        img-left
        class="w-100 mb-3 p-2 mt-3"
      >
      <b-skeleton-img
        card-img="left"
        width="210px"
      />

      <div class="w-50 ml-3">
        <b-skeleton class="w-50" />
        <b-skeleton class="w-25" />
      </div>
      </b-card>
    </template>

    <empty-state
      v-else-if="!boards.length"
      title="Boards"
      message="Use boards to easily organize your video game collections"
    >
      <create-board />
    </empty-state>

    <b-row v-else>
      <div class="d-flex w-100 justify-content-between align-items-center mb-3">
        <h3 class="m-0 mr-a">{{ $t('boards.title') }}</h3>

        <create-board />
      </div>

      <div class="boards">
        <b-card
          v-for="board in sortedBoards"
          :key="board.id"
          no-body
          :bg-variant="nightMode ? 'dark' : null"
          :text-variant="nightMode ?  'white' : null"
          class="overflow-hidden clickable"
          @click="viewBoard(board.id)"
        >
          <mini-board
            :board="board"
            :background-image="getWallpaper(board)"
          />
        </b-card>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    CreateBoard,
    MiniBoard,
    EmptyState,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'gameLists', 'settings']),
    ...mapGetters(['platformNames', 'sortedBoards', 'nightMode']),

    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },

    showPlaceholder() {
      return this.loading && Object.keys(this.boards).length === 0;
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadPlatforms();
    },

    getWallpaper({ wallpaper }) {
      const boardWallpaper = this.wallpapers.find(({ fullPath }) => fullPath === wallpaper);

      return this.wallpapers.length && boardWallpaper && boardWallpaper.url;
    },

    getPlatformImage(id) {
      const { platformNames } = this;

      return id && platformNames && platformNames[id] && platformNames[id].logoFormat
        ? `/static/platform-logos/${platformNames[id].slug}.${platformNames[id].logoFormat}`
        : '';
    },

    async loadPlatforms() {
      await this.$store.dispatch('LOAD_IGDB_PLATFORMS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading platforms', { variant: 'error' });
        });

      this.loadBoards();
    },

    async loadBoards() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;
    },

    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
    },

    confirmDelete(id) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this board?', {
        title: 'Delete board',
        okVariant: 'danger',
        okTitle: 'Yes, delete board',
      })
        .then((value) => {
          if (value) {
            this.deleteBoard(id);
          }
        });
    },

    async deleteBoard(id) {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', id)
        .catch(() => {
          this.loading = false;

          this.$bvToast.toast('There was an error deleting board', { variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.boards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
</style>
