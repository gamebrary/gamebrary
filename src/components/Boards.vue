<template lang="html">
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h5>Boards</h5>

      <create-board />
    </div>

    <div class="text-right" v-if="!loading && !boards.length">
      <b-img src="/static/img/empty-state.png" fluid class="mr-5" />
    </div>

    <b-overlay :show="loading && !platforms.length" rounded="sm" variant="transparent">
      <b-form-row>
        <b-col
          v-for="board in sortedBoards"
          :key="board.id"
          class="d-flex mt-2"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <b-card
            no-body
            class="clickable w-100"
            @click="viewBoard(board.id)"
          >
            <template v-slot:header>
              <h4 class="mb-0">{{ board.name }}</h4>
            </template>

            <b-card-body>
              <b-card-text v-if="board.description">
                {{ board.description }}
              </b-card-text>
              <b-avatar-group v-if="Object.keys(platformNames).length">
                <!-- eslint-disable-next-line -->
                <b-avatar :src="getPlatformImage(id)"
                  v-for="id in board.platforms"
                  :key="id"
                  variant="light"
                  size="sm"
                />
              </b-avatar-group>
            </b-card-body>

            <b-card-img
              :src="getWallpaper(board)"
              :alt="board.name"
              bottom
            />
          </b-card>
        </b-col>

        <b-col
          class="d-flex mt-2"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="platform in ownedPlatforms"
          :key="platform.id"
        >
          <b-card
            no-body
            border-variant="warning"
            class="clickable w-100"
            @click="openDeprecationWarning(platform)"
          >
            <template v-slot:header>
              <h4 class="mb-0">
                {{ platform.name }}
                <b-badge variant="warning">Deprecated</b-badge>
              </h4>
            </template>

            <b-card-body>
              <b-avatar
                :src="`/static/img/platforms/logos/${platform.code}.svg`"
                variant="light"
                size="sm"
              />
            </b-card-body>
          </b-card>
        </b-col>
      </b-form-row>

      <b-modal
        id="deprecation-warning"
        :title="tempPlatform && tempPlatform.name ? tempPlatform.name : 'Migration warning'"
        hide-footer
        @hidden="resetLegacyPlatform"
      >
        <b-alert show variant="warning">
          <h4>Deprecation warning</h4>
          <p>Platform-based boards will be phased out soon</p>
          <p>Please click the button below to convert this platform into a board.</p>
          <p>If you have any questions or need help feel free to email
            <strong>contact@gamebrary.com</strong> and/or open defects in
            <a href="https://github.com/romancm/gamebrary/issues" target="_blank">GitHub</a></p>
        </b-alert>

        <b-button
          variant="success"
          @click="convertLegacyBoard({ tempPlatform, migratePlatform  })"
          :disabled="saving"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Convert to board</span>
        </b-button>

        <b-button
          variant="danger"
          @click="deleteLegacyPlatform(tempPlatform)"
        >
          Delete legacy board
        </b-button>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';
import platforms from '@/platforms';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    CreateBoard,
    platforms,
  },

  data() {
    return {
      loading: false,
      tempPlatform: null,
      migratePlatform: null,
      saving: false,
      platforms,
    };
  },

  computed: {
    ...mapState(['boards', 'platforms', 'platformNames', 'wallpapers', 'gameLists', 'settings']),
    ...mapGetters(['platformNames', 'sortedBoards']),

    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },

    ownedPlatforms() {
      return this.platforms.filter(({ code }) => this.gameLists[code]);
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

    async convertLegacyBoard({ tempPlatform, migratePlatform }) {
      this.saving = true;

      const lists = migratePlatform.map(({ games, name }) => {
        const list = {
          name,
          games,
          settings: {},
        };

        return list;
      });

      const { id } = tempPlatform;

      const parsedPlatforms = isNaN(id) && id.includes(',')
        ? id.split(',').map(platformId => Number(platformId))
        : [id];

      const newBoard = {
        description: '',
        lists,
        name: tempPlatform.name,
        platforms: parsedPlatforms,
        theme: null,
        wallpaper: null,
      };

      await this.$store.dispatch('CREATE_BOARD', newBoard)
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error creating board', { title: 'Error', variant: 'error' });
        });

      this.saving = false;
      this.$bvToast.toast('Board converted', { title: 'Success', variant: 'success' });
      this.$bvModal.hide('deprecation-warning');
      this.showDeleteLegacyPlatform(tempPlatform);
    },

    showDeleteLegacyPlatform(tempPlatform) {
      this.$bvModal.msgBoxConfirm('You can now safely delete your legacy platform', {
        title: 'Board converted',
        okVariant: 'danger',
        cancelTitle: 'Dismiss',
        okTitle: 'Delete legacy board',
      })
        .then((value) => {
          if (value) {
            this.deleteLegacyPlatform(tempPlatform);
          }
        });
    },

    openDeprecationWarning(platform) {
      this.migratePlatform = this.gameLists[platform.code];
      this.tempPlatform = platform;
      this.$bvModal.show('deprecation-warning');
    },

    resetLegacyPlatform() {
      this.tempPlatform = null;
      this.migratePlatform = null;
    },

    deleteLegacyPlatform(platform) {
      this.$store.commit('SET_PLATFORM_LEGACY', platform);

      this.$store.commit('REMOVE_PLATFORM_LEGACY');

      this.$store.dispatch('SAVE_LEGACY_LISTS', this.gameLists)
        .then(() => {
          this.$bvModal.hide('deprecation-warning');
          this.$bvToast.toast('Legacy board deleted', { title: 'Success', variant: 'success' });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
        });
    },

    getWallpaper({ wallpaper, name }) {
      const boardWallpaper = this.wallpapers.find(({ fullPath }) => fullPath === wallpaper);

      return this.wallpapers.length && boardWallpaper && boardWallpaper.url
        ? boardWallpaper.url
        : `https://via.placeholder.com/512x288?text=${name}`;
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
          this.$bvToast.toast('There was an error loading boards', { title: 'Error', variant: 'error' });
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
