<template lang="html">
  <b-modal
    id="game-modal"
    scrollable
    size="lg"
    footer-class="p-2 justify-content-center"
    :title="game.name"
    @show="load"
    @hidden="reset"
  >
    <b-container v-if="game.name" class="m-0 p-0">
      <b-row>
        <b-col cols="12" md="4" class="text-center">
          <b-img
            :src="coverUrl"
            :alt="game.name"
            class="game-cover"
            rounded
            fluid
          />

          <b-progress
            v-if="progress"
            :value="progress"
            variant="success"
            height="8px"
            class="mt-2"
          />
        </b-col>

        <b-col cols="12" md="8" class="mt-md-0 mt-3 text-md-left text-center">
          <h3 class="mb-0">{{ game.name }}</h3>

          <!-- <h6>
            <b-badge
              v-if="releaseDate"
              variant="secondary"
            >
              Releases in
              {{ releaseDate }}
            </b-badge>
          </h6> -->

          <b-form-rating
            v-if="rating"
            :value="rating"
            class="p-0 mt-1 border-0 shadow-none"
            inline
            readonly
            variant="warning"
            size="lg"
            no-border
          />

          <b-badge
            v-for="({ games, hex, tagTextColor }, name) in tags"
            v-if="games.includes(game.id)"
            :key="name"
            pill
            tag="small"
            class="mr-1 mb-2"
            :style="`background-color: ${hex}; color: ${tagTextColor}`"
          >
            {{ name }}
          </b-badge>

          <div v-if="loading" class="my-2">
            <b-button variant="light">
              <b-icon-clock-history />
            </b-button>

            <b-button variant="light">
              <b-icon-file-earmark-text />
            </b-button>

            <b-button variant="light">
              <b-icon-tag />
            </b-button>

            <b-button variant="light">
              <b-icon-trash />
            </b-button>
          </div>

          <div v-if="!loading" class="my-2">
            <game-progress :game="game" />
            <game-notes :game="game" />
            <game-tags :game="game" />
            <add-remove-game :game="game" :list="list" />
          </div>

          <placeholder :lines="3" v-if="loading"/>
          <p v-else class="text-left">{{ game.summary }}</p>
        </b-col>
      </b-row>

      <game-detail-placeholder v-if="loading" />

      <b-card v-else class="mt-4" no-body>
        <b-tabs card>
          <game-details-tab :game="game" />
          <game-notes-tab :game="game" />
          <game-websites-tab :game="game" />
          <game-videos-tab :game="game" />
          <game-screenshots-tab :game="game" />
        </b-tabs>
      </b-card>
    </b-container>

    <template v-slot:modal-footer>
      <igdb-logo />
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import GameDetailPlaceholder from '@/components/Game/GameDetailPlaceholder';
import GameDetailsTab from '@/components/Game/GameDetailsTab';
import GameNotesTab from '@/components/Game/GameNotesTab';
import GameScreenshotsTab from '@/components/Game/GameScreenshotsTab';
import GameVideosTab from '@/components/Game/GameVideosTab';
import GameWebsitesTab from '@/components/Game/GameWebsitesTab';
import GameNotes from '@/components/Game/GameNotes';
import GameProgress from '@/components/Game/GameProgress';
import AddRemoveGame from '@/components/Game/AddRemoveGame';
import GameTags from '@/components/Game/GameTags';
import IgdbLogo from '@/components/IgdbLogo';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    Placeholder,
    GameTags,
    IgdbLogo,
    GameDetailPlaceholder,
    GameDetailsTab,
    GameNotesTab,
    GameScreenshotsTab,
    GameVideosTab,
    GameWebsitesTab,
    GameNotes,
    GameProgress,
    AddRemoveGame,
  },

  data() {
    return {
      gameId: null,
      game: {},
      loading: true,
    };
  },

  computed: {
    // TODO: rename gameModalData
    ...mapState(['gameModalData', 'games', 'platform', 'progresses', 'tags']),

    releaseDate() {
      const releaseDate = this.game
        && this.game.release_dates
        && this.game.release_dates.find(({ platform }) => this.platform.id === platform);

      const formattedDate = releaseDate && releaseDate.date
        ? moment.unix(releaseDate.date)
        : null;

      return moment(formattedDate).isAfter()
        ? formattedDate.toNow(true)
        : null;
    },

    progress() {
      const { gameId, progresses } = this;

      return progresses[gameId] || null;
    },

    coverUrl() {
      return this.game
        && this.game.cover
        && this.game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${this.game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },

    rating() {
      return this.game && this.game.rating
        ? Math.round((this.game.rating / 20) * 2) / 2
        : false;
    },
  },

  methods: {
    load() {
      const { gameId, list } = this.gameModalData;

      this.gameId = gameId;
      this.list = list;
      this.game = this.games[gameId];

      this.loadGame();
    },

    async loadGame() {
      this.loading = true;

      const { gameId } = this.gameModalData;

      const game = await this.$store.dispatch('LOAD_GAME', gameId)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('Error loading game', { title: 'Error', variant: 'error' });
        });

      // avoid error when closing modal before game finishes loading
      if (!this.game) {
        return;
      }

      this.game = {
        ...this.game,
        ...game,
      };

      this.loading = false;

      // this.$ga.event({
      //   eventCategory: 'game',
      //   eventAction: 'view',
      //   eventLabel: 'gameViewed',
      //   eventValue: `${this.platform.name} - ${this.game.name}`,
      // });
    },

    reset() {
      this.gameId = null;
      this.loading = true;
      this.game = {};
    },
  },
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
  .b-rating {
    line-height: normal !important;
    height: auto !important;
  }

  .game-cover {
    max-height: 50vh;
    margin: 0 auto;
  }
</style>
