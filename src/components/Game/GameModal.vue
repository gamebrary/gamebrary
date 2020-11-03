<template lang="html">
  <b-modal
    id="game-modal"
    scrollable
    size="lg"
    footer-class="p-2 justify-content-center"
    header-class="align-items-center pb-0 border-0"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    :footer-bg-variant="nightMode ? 'dark' : null"
    :footer-text-variant="nightMode ? 'white' : null"
    @show="load"
    @hidden="reset"
  >
  <!-- header-bg-variant="dark"
  body-bg-variant="dark"
  footer-bg-variant="dark" -->
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="game.name"
        :subtitle="gameModalData.list ? gameModalData.list.name : null"
        @close="close"
      >
        <b-button-group v-if="gameModalData.list">
          <b-button
            size="sm"
            :variant="nightMode ? 'dark' : 'light'"
            :disabled="prevDisabled"
            @click="previousGame"
          >
            <icon name="triangle-left" />
          </b-button>

          <b-button
            size="sm"
            :variant="nightMode ? 'dark' : 'light'"
            :disabled="nextDisabled"
            @click="nextGame"
          >
            <icon name="triangle-right" />
          </b-button>
        </b-button-group>
      </modal-header>
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

          <game-screenshots :game="game" v-if="!loading" />
          <game-notes :game="game" />
        </b-col>

        <b-col cols="12" md="8" class="mt-md-0 mt-3 text-md-left text-center">
          <h3 class="mb-0">{{ game.name }}</h3>

          <b-progress
            v-if="progress"
            :value="progress"
            variant="success"
            height="8px"
            class="my-1 w-50"
          />

          <b-form-rating
            v-if="rating"
            :value="rating"
            :class="['p-0 mt-1', { 'bg-dark': nightMode }]"
            inline
            readonly
            variant="warning"
            size="lg"
            no-border
          />

          <br />

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

          <div
            v-if="loading"
            class="my-2 d-flex justify-content-md-start justify-content-center"
          >
            <b-skeleton
              v-for="n in 4"
              :key="n"
              type="button"
              width="45px"
              class="mr-1"
            />
          </div>

          <div v-else class="my-2">
            <game-progress :game="game" />
            <game-notes-modal :game="game" />
            <game-tags :game="game" />
            <add-remove-game :game="game" :list="list" />
          </div>

          <template v-if="loading">
            <b-skeleton v-for="n in 3" :key="n" />
          </template>

          <template v-else>
            <p class="text-left">{{ game.summary }}</p>
            <game-details :game="game" />
            <game-websites :game="game" />
            <game-videos :game="game" />
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
import { mapState, mapGetters } from 'vuex';
import GameDetails from '@/components/Game/GameDetails';
import GameNotes from '@/components/Game/GameNotes';
import GameScreenshots from '@/components/Game/GameScreenshots';
import GameVideos from '@/components/Game/GameVideos';
import GameWebsites from '@/components/Game/GameWebsites';
import GameNotesModal from '@/components/Game/GameNotesModal';
import GameProgress from '@/components/Game/GameProgress';
import AddRemoveGame from '@/components/Game/AddRemoveGame';
import GameTags from '@/components/Game/GameTags';
import IgdbLogo from '@/components/IgdbLogo';

export default {
  components: {
    GameTags,
    IgdbLogo,
    GameDetails,
    GameNotes,
    GameScreenshots,
    GameVideos,
    GameWebsites,
    GameNotesModal,
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
    ...mapGetters(['nightMode']),

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

    gameIndex() {
      const { gameId, list } = this.gameModalData;

      return list && list.games.indexOf(gameId);
    },

    prevDisabled() {
      return this.gameIndex === 0;
    },

    nextDisabled() {
      const { list } = this.gameModalData;

      return this.list && list.games && this.gameIndex === list.games.length - 1;
    },
  },

  methods: {
    previousGame() {
      const { gameId, list } = this.gameModalData;

      const index = list.games.indexOf(gameId);

      const prevGameId = list.games[index - 1];

      this.$store.commit('SET_GAME_MODAL_DATA', {
        gameId: prevGameId,
        list,
      });

      this.load();
    },

    nextGame() {
      const { gameId, list } = this.gameModalData;

      const index = list.games.indexOf(gameId);

      const nextGameId = list.games[index + 1];

      this.$store.commit('SET_GAME_MODAL_DATA', {
        gameId: nextGameId,
        list,
      });

      this.load();
    },

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
