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

      <b-card
        no-body
        border-variant="warning"
        class="clickable mt-3"
        v-for="platform in ownedPlatforms"
        :key="platform.id"
        @click="openDeprecationWarning(platform)"
      >
        <b-card-body>
          <h4 class="mb-2">
            {{ platform.name }}
            <b-badge variant="warning">{{ $t('boards.deprecated') }}</b-badge>
          </h4>
        </b-card-body>
      </b-card>

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
import legacyPlatforms from '@/platforms';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    CreateBoard,
  },

  data() {
    return {
      loading: false,
      tempPlatform: null,
      migratePlatform: null,
      saving: false,
    };
  },

  computed: {
    ...mapState(['boards', 'platforms', 'platformNames', 'wallpapers', 'gameLists', 'settings']),
    ...mapGetters(['platformNames', 'sortedBoards']),

    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },

    ownedPlatforms() {
      return legacyPlatforms.filter(({ code }) => this.gameLists[code]);
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
      this.$store.commit('SET_ACTIVE_PLATFORM_LEGACY', platform);

      this.$store.commit('REMOVE_PLATFORM_LEGACY');

      this.$store.dispatch('SAVE_LEGACY_LISTS', this.gameLists)
        .then(() => {
          this.$bvModal.hide('deprecation-warning');
          this.$bvToast.toast('Legacy board deleted', { title: 'Success', variant: 'success' });
        })
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
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
