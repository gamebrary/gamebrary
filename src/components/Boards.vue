<template lang="html">
  <div>
    <!-- TODO: allow board settings to be accessed here -->
    <!-- TODO: allow to override backdrop using search -->
    <div class="d-flex justify-content-between align-items-center">
      <h5>{{ $t('boards.title') }}</h5>

      <div>
        <create-board />
      </div>
    </div>

    <div class="text-right" v-if="!loading && !boards.length">
      <b-img src="/static/img/empty-state.png" fluid class="mr-5" />
    </div>

    <b-overlay :show="loading" rounded="sm" variant="transparent">
      <b-card
        v-for="board in sortedBoards"
        :key="board.id"
        no-body
        :bg-variant="nightMode ? 'dark' : null"
        :text-variant="nightMode ?  'white' : null"
        class="overflow-hidden clickable mt-3"
        @click="viewBoard(board.id)"
      >
        <b-row no-gutters>
          <b-col md="3" v-if="board.wallpaper">
            <b-card-img
              :src="getWallpaper(board)"
              :alt="board.name"
            />
          </b-col>

          <b-col md="9" >
            <b-card-body :title="board.name" title-tag="h5">
              <b-card-text v-if="board.description">
                {{ board.description }}
              </b-card-text>

              <span :id="board.id">
                {{ board.platforms.length }} {{ $t('boards.platforms') }}
              </span>

              <b-popover :target="board.id" triggers="hover">
                <div v-for="id in board.platforms" :key="id">
                  {{ platformNames[id].name }}
                </div>
              </b-popover>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    CreateBoard,
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
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadBoards();
      this.loadPlatforms();
    },

    getWallpaper({ wallpaper, name }) {
      const boardWallpaper = this.wallpapers.find(({ fullPath }) => fullPath === wallpaper);

      return this.wallpapers.length && boardWallpaper && boardWallpaper.url
        ? boardWallpaper.url
        : `https://via.placeholder.com/300x100?text=${name}`;
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
          this.$bvToast.toast('There was an error loading platforms', { title: 'Error', variant: 'error' });
        });
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

          this.$bvToast.toast('There was an error deleting board', { title: 'Error', variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed', { title: 'Success', variant: 'success' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.b-avatar .b-avatar-img img {
  width: 40px !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>
