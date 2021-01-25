<template lang="html">
  <b-modal
    id="game-modal"
    scrollable
    size="lg"
    footer-class="p-2 justify-content-center"
    header-class="align-items-center border-0 pb-2"
    hide-footer
    body-class="pt-0"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    @show="load"
    @hidden="reset"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="game.name"
        :subtitle="gameModalData.list ? gameModalData.list.name : null"
        @close="close"
      >
        <b-button-group v-if="hasMultipleGames">
          <b-button
            :variant="nightMode ? 'dark' : 'light'"
            :disabled="prevDisabled"
            @click="previousGame"
          >
            <i class="fas fa-caret-left fa-fw" aria-hidden />
          </b-button>

          <b-button
            :variant="nightMode ? 'dark' : 'light'"
            :disabled="nextDisabled"
            @click="nextGame"
          >
            <i class="fas fa-caret-right fa-fw" aria-hidden />
          </b-button>
        </b-button-group>

        <b-dropdown
          right
          no-caret
          :variant="nightMode ? 'dark' : 'light'"
        >
          <template v-slot:button-content>
            <i class="fas fa-ellipsis-h fa-fw" aria-hidden></i>
          </template>

          <game-progress :game="game" />
          <game-notes-modal :game="game" />
          <game-tags :game="game" />
          <add-remove-game v-if="list" :game="game" :list="list" />
        </b-dropdown>
      </modal-header>
    </template>

    <b-container
      v-if="game.name"
      fluid
      class="m-0 p-0"
    >
      <b-row>
        <b-col
          cols="12"
          md="5"
          lg="4"
          class="sidebar"
        >
          <b-skeleton-img
            v-if="loading"
            width="100%"
            height="200px"
          />

          <template v-else>
            <b-img
              :src="coverUrl"
              :alt="game.name"
              class="game-cover"
              rounded
            />

            <game-screenshots :game="game" />
            <!-- <game-videos :videos="game.videos" v-if="game.videos" /> -->
            <amazon-links :game="game" class="d-none d-md-inline" />
          </template>

          <game-notes :game="game" />
          <!-- TODO: add related games -->
          <!-- More games like {{ game.name }} -->
          <!-- <pre>{{ game.genres.map(({ id }) => id) }}</pre> -->
        </b-col>

        <!-- cols="12"
        md="7"  -->
        <b-col
          cols="12"
          md="7"
          lg="8"
        >
          <h3 class="mb-0">{{ game.name }}</h3>

          <b-progress
            v-if="progress"
            :value="progress"
            variant="success"
            height="8px"
            v-b-modal.progress
            class="my-1 w-50 mx-auto mx-md-0"
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
            v-b-modal.tags
          >
            {{ name }}
          </b-badge>

          <template v-if="loading">
            <b-skeleton v-for="n in 3" :key="n" />
          </template>

          <template v-else>
            <p>{{ game.summary }}</p>

            <amazon-links
              :game="game"
              class="d-md-none"
              modal-id="mobile-amazon"
            />

            <b-alert show variant="secondary" v-if="game.alternative_names">
              <strong>Also known as:</strong>
              <ul>
                <li
                  v-for="alternativeName in game.alternative_names"
                  :key="alternativeName.id"
                >
                  {{ alternativeName.name }} ({{ alternativeName.comment }})
                </li>
              </ul>
            </b-alert>
            <game-details :game="game" />
            <game-websites :game="game" />
          </template>
        </b-col>

        <igdb-logo />
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameDetails from '@/components/Game/GameDetails';
import GameNotes from '@/components/Game/GameNotes';
import GameScreenshots from '@/components/Game/GameScreenshots';
import AmazonLinks from '@/components/Game/AmazonLinks';
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
    AmazonLinks,
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

    hasMultipleGames() {
      // TODO: use optional chaining
      return this.gameModalData
        && this.gameModalData.list
        && this.gameModalData.list.games
        && this.gameModalData.list.games.length > 1;
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
      // TODO: account for list sorting when getting previous game
      this.loading = true;

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
      // TODO: account for list sorting when getting next game
      this.loading = true;

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
          this.$bvToast.toast('Error loading game', { variant: 'error' });
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
    width: 100%;
    height: auto;

    // @media(max-width: 780px) {
    //   max-height: 40vh;
    //   width: auto;
    //   display: block;
    //   margin: 0 auto;
    // }
  }

  .sidebar {
    @media(min-width: 768px) {
      position: sticky;
      top: 0;
      align-self: baseline;
    }
  }
</style>
