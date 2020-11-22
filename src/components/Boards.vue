<template lang="html">
  <div>
    <!-- TODO: allow board settings to be accessed here -->

    <template v-if="loading">
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

    <empty-state v-else-if="!boards.length" />

    <template v-else>
      <div class="d-flex justify-content-between align-items-center">
        <h2>{{ $t('boards.title') }}</h2>

        <create-board />
      </div>

      <b-card
        v-for="board in sortedBoards"
        :key="board.id"
        no-body
        :bg-variant="nightMode ? 'dark' : null"
        :text-variant="nightMode ?  'white' : null"
        class="overflow-hidden clickable mt-3"
        @click="viewBoard(board.id)"
      >
        <b-row>
          <b-col cols="6" md="3">
            <b-img
              v-if="board.wallpaper"
              rounded
              class="m-2 w-100"
              :src="getWallpaper(board)"
              :alt="board.name"
            />

            <b-img
              v-else
              rounded
              :alt="board.name"
              class="m-2 w-100"
              width="150"
              height="84"
              blank
              blank-color="darkgray"
              fluid
            />
          </b-col>

          <b-col cols="6" md="9" class="p-2" >
            <h6 class="m-0">{{ board.name }}</h6>

            <small :id="board.id">
              {{ board.platforms.length }} {{ $t('boards.platforms') }}
            </small>

            <b-popover :target="board.id" triggers="hover">
              <div v-for="id in board.platforms" :key="id">
                {{ platformNames[id].name }}
              </div>
            </b-popover>

            <p class="text-muted small" v-if="board.description">
              {{ board.description }}
            </p>
          </b-col>
        </b-row>
      </b-card>
    </template>
  </div>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';
import EmptyState from '@/components/EmptyState';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    CreateBoard,
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
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
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
