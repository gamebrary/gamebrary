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
    <template v-slot:modal-header="{ close }">
      <div>
        <b-button-group>
          <b-button>
            <icon name="triangle-left" />
          </b-button>
          <b-button>
            <icon name="triangle-right" />
          </b-button>
        </b-button-group>
      </div>

      <b-button @click="close">
        <icon name="x" />
      </b-button>
    </template>

    <b-container v-if="game.name" class="m-0 p-0">
      <b-row>
        <b-col cols="12" md="4">
          <b-img
            :src="coverUrl"
            :alt="game.name"
            class="game-cover"
            rounded
            fluid
          />

          <game-screenshots :game="game" />

          <game-notes-tab :game="game" />
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

          <b-progress
            v-if="progress"
            :value="progress"
            variant="success"
            height="8px"
            class="mt-2"
          />

          <div v-if="loading" class="my-2 d-flex justify-content-md-start justify-content-center">
            <b-skeleton type="button" width="45px" v-for="n in 4" :key="n" class="mr-1" />
          </div>

          <div v-else class="my-2">
            <game-progress :game="game" />
            <game-notes :game="game" />
            <game-tags :game="game" />
            <add-remove-game :game="game" :list="list" />
          </div>

          <template v-if="loading">
            <b-skeleton v-for="n in 3" :key="n" />

            <game-detail-placeholder />
          </template>

          <template v-else>
            <game-details :game="game" />

            <b-card class="mt-4" no-body>
              <b-tabs card>
                <game-websites-tab :game="game" />
                <game-videos-tab :game="game" />
              </b-tabs>
            </b-card>
          </template>
        </b-col>
      </b-row>
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
import GameDetails from '@/components/Game/GameDetails';
import GameNotesTab from '@/components/Game/GameNotesTab';
import GameScreenshots from '@/components/Game/GameScreenshots';
import GameVideosTab from '@/components/Game/GameVideosTab';
import GameWebsitesTab from '@/components/Game/GameWebsitesTab';
import GameNotes from '@/components/Game/GameNotes';
import GameProgress from '@/components/Game/GameProgress';
import AddRemoveGame from '@/components/Game/AddRemoveGame';
import GameTags from '@/components/Game/GameTags';
import IgdbLogo from '@/components/IgdbLogo';

export default {
  components: {
    GameTags,
    IgdbLogo,
    GameDetailPlaceholder,
    GameDetails,
    GameNotesTab,
    GameScreenshots,
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
    // max-height: 50vh;
    width: 100%;
    margin: 0 auto;
  }
</style>
