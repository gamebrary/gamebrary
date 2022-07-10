<!-- TODO: add bundles to game detail? -->
<!-- {{ game.bundles ? `Found in ${game.bundles.length} compilations.` : null }} -->
<!-- TODO: add speedruns -->
<!-- TODO: add pricecharting info -->
<!-- TODO: show GOG buy button -->
<!-- TODO: Show lists/boards that the game belongs to -->

<template lang="html">
  <b-container fluid class="px-2 pb-2">
    <b-skeleton v-if="loading" />

    <template v-else-if="game">
      <b-row class="game">
        <b-col
          offset="2"
          offset-sm="0"
          cols="8"
          sm="4"
          md="4"
          xl="3"
        >
          <b-img
            :src="gameCoverUrl"
            :alt="game.name"
            class="cursor-pointer game-cover"
            fluid-grow
            rounded
            @click.stop="openGameCover"
          />
          <!-- <b-skeleton-img
            v-if="loading"
            width="100px"
            height="100px"
          /> -->

          <amazon-links class="mt-2" />

          <div class="game-info">
            <game-rating :game="game" />
          </div>
        </b-col>

        <b-col
          cols="12"
          sm="8"
          md="8"
          lg="8"
          xl="9"
          class="bg-white rounded p-5"
        >
          <b-row>
            <b-col
              offset="12"
              offset-sm="0"
              cols="12"
              sm="12"
              md="7"
              xl="8"
            >
              <game-titles />
              <b-progress
                v-if="progress"
                :value="progress"
                variant="success"
                height="8px"
                v-b-modal.progress
                class="my-1 w-25"
                @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
              />
              <b-badge variant="success" v-if="game && game.steam && game.steam.metacritic">{{ game.steam.metacritic.score }}</b-badge>

              <b-badge
                v-for="({ hex, tagTextColor }, name) in gameTags"
                :key="name"
                pill
                tag="small"
                class="mr-1 mb-2"
                :style="`background-color: ${hex}; color: ${tagTextColor}`"
                @click="$router.push({ name: 'game.tags', params: { id: game.id, slug: game.slug } })"
                v-b-modal.tags
              >
                {{ name }}
              </b-badge>
              <game-description />

              <game-notes />
            </b-col>

            <b-col
              offset="1"
              offset-sm="0"
              cols="10"
              sm="12"
              md="5"
              xl="4"
            >
              <b-card
                no-body
              >
                <b-link :to="{ name: 'game.media', params: { id: game.id, slug: game.slug } }">
                  <b-card-img :src="gameScrenshot" top />
                </b-link>
                <b-button
                  class="m-1"
                  variant="light"
                  :to="{ name: 'game.media', params: { id: game.id, slug: game.slug } }"
                >
                  <i class="fa-solid fa-photo-film" />
                  Videos & Screenshots
                </b-button>

                <game-details />
                <game-websites
                  :game="game"
                />

                <b-card-footer v-if="legalNotice">
                  <small class="text-muted" v-html="legalNotice" />
                </b-card-footer>

                <!-- TODO: use speedrun logo -->
                <!-- <pre>{{ game}}</pre> -->
                <!-- <b-card-img src="https://placekitten.com/480/210" alt="Image" bottom></b-card-img> -->
              </b-card>
            </b-col>
          </b-row>
        </b-col>

        <b-col
          cols="12"
          class="mt-3"
        >
          <similar-games
            :loading="loading"
          />
        </b-col>

        <b-col
          cols="12"
          sm="12"
          md="6"
          xl="6"
          class="mt-3"
        >
          <!-- <game-speedruns v-if="game" /> -->
          <!-- <pre>{{ game.speedruns }}</pre> -->
          <!-- TODO: add bundles to game detail? -->
        </b-col>

        <!-- <b-col
          cols="12"
          class="mt-3"
        >
          <b-card>
            <h4>[BUNDLES]</h4>
          </b-card>
          <pre>{{ game }}</pre>
          {{ game.bundles ? `Found in ${game.bundles.length} compilations.` : null }}
        </b-col> -->
      </b-row>
    </template>

    <div class="pt-5" v-else>
      <div class="d-flex justify-content-center align-items-center" id="main">
        <h1 class="mr-3 pr-3 align-top border-right inline-block align-content-center">404</h1>
        <div class="inline-block align-middle">
          <h2 class="font-weight-normal lead" id="desc">Game was not found.</h2>
        </div>
      </div>
    </div>

    <b-row>
      <b-col
        cols="10"
        sm="6"
        md="7"
        offset="1"
        offset-sm="0"
        lg="6"
      >
        <!-- <pre class="text-dark small">{{ game.gog.price }}</pre> -->

        <!-- <small>
          <pre class="text-dark">{{ steamGame }}</pre>
        </small> -->
        <!-- <small v-if="gog && gog.isPriceVisible">{{gog.price.symbol}}{{ gog.price.amount }}</small> -->
        <!-- <small><pre class="text-dark">{{ gog }}</pre></small> -->
        <!-- <pre class="small text-dark">{{ steamGame }}</pre> -->

        <!-- TODO: use percentage instead? -->

        <!-- TODO: add icons for game modes:
        single-player
        multiplayer
        co-operative
        split-screen
        massively-multiplayer-online-mmo
        battle-royale -->

        <!-- <template v-if="!loading">
          <b-skeleton v-for="n in 3" :key="n" />
        </template> -->

        <!-- <b-form-rating
          v-if="rating"
          :value="rating"
          inline
          readonly
          variant="warning"
          size="lg"
          no-border
        />

        <br /> -->
      </b-col>
    </b-row>
    <!-- <b-button variant="info" @click="openGameNews">
      <b-badge>3</b-badge>
      News about {{ game.name }}
    </b-button> -->
    <!-- TODO: restore prev/next game -->
    <!-- <b-dropdown-item-button
      v-if="!prevDisabled"
      v-shortkey="['arrowleft']"
      @shortkey.native="previousGame"
      @click="previousGame"
    >
      <i class="fas fa-caret-left fa-fw" aria-hidden /> Previous game

    </b-dropdown-item-button>

    <b-dropdown-item-button
      v-if="!nextDisabled"
      v-shortkey="['arrowright']"
      @shortkey.native="nextGame"
      @click="nextGame"
    >
      <i class="fas fa-caret-right fa-fw" aria-hidden /> Next game
    </b-dropdown-item-button> -->
    <!-- <pre>{{ game.genres.map(({ id }) => id) }}</pre> -->

    <!-- <timeline
      v-if="twitterHandle"
      :id="twitterHandle"
      sourceType="profile"
    >
      loading...
    </timeline> -->
  </b-container>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';
import AmazonLinks from '@/components/Game/AmazonLinks';
import GameNotes from '@/components/Game/GameNotes';
import GameDetails from '@/components/Game/GameDetails';
import GameTitles from '@/components/Game/GameTitles';
import GameRating from '@/components/Game/GameRating';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameWebsites from '@/components/Game/GameWebsites';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';

export default {
  components: {
    // Timeline,
    AmazonLinks,
    GameDescription,
    GameDetails,
    GameTitles,
    GameRating,
    GameNotes,
    GameWebsites,
    // GameSpeedruns,
    SimilarGames,
  },

  data() {
    return {
      gog: null,
      steamGame: null,
      loading: false,
    };
  },

  beforeDestroy() {
    this.$bus.$emit('UPDATE_WALLPAPER', null);
    // TODO: only clear board if game being viewed is not in current board
    // if (!['game', 'board'].includes(this.$route.name)) {
      // this.$store.commit('CLEAR_BOARD');
    // }
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags']),
    ...mapGetters(['gameTags']),

    legalNotice() {
      return this.game?.steam?.legal_notice;
    },

    // prevDisabled() {
    //   return this.gameIndex === 0;
    // },
    //
    // nextDisabled() {
    //   const isLast = this.gameIndex === list.games.length - 1;
    //
    //   return !this.list || isLast;
    // },

    twitterHandle() {
      // TODO: put in constant
      const twitterCategory = 5;

      const twitterUrl = this.game?.websites
        ? this.game.websites.find(({ category }) => category === twitterCategory)
        : '';

      return twitterUrl?.url
        ? twitterUrl.url.split('twitter.com/')[1]
        : null;
    },

    gameCoverUrl() {
      const imageId = this.game?.cover?.image_id;

      return imageId
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId}.jpg`
        : '/no-image.jpg';
    },

    progress() {
      const { gameId, progresses } = this;

      return progresses[gameId] || null;
    },

    gameId() {
      return this.$route.params.id;
    },

    gameScrenshot() {
      const screenshots = this.game?.screenshots;

      return screenshots?.length > 0
        ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${screenshots[0].image_id}.jpg`
        : null;
    },

    wikipediaData() {
      return this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);
    },
  },

  watch: {
    gameId(gameId) {
      // document.getElementsByTagName('main')[0].scrollTop = 0;

      if (gameId) this.loadGame();
      // TODO: handle missing id, redirect? 404? search?
    },

    gameScrenshot(value) {
      if (value) this.$bus.$emit('UPDATE_WALLPAPER', value);
    },
  },

  mounted() {
    // TODO: wait for access token
    this.loadGame();

    this.$store.dispatch('IGDB', { path: 'game_modes', data: 'fields *;' });
  },

  methods: {
    openGameCover() {
      this.$router.push({
        name: 'game.media',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },

    openGameNews() {
      this.$router.push({
        name: 'game.news',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },

    async loadGame() {
      const gameCached = this.game?.id === this.gameId;

      if (!this.gameId || gameCached) return;

      this.loading = true;
      this.$store.commit('CLEAR_GAME');


      await this.$store.dispatch('LOAD_GAME', this.gameId)
        .catch(() => {
          this.loading = false;

          return;
          // this.$bvToast.toast('Error loading game', { variant: 'error' });
        });

      this.loading = false;
      console.log('loadSupplementalData');
      this.loadSupplementalData();
    },

    // previousGame() {
    //   // TODO: account for list sorting when getting previous game
    //   this.loading = true;
    //
    //   const index = list.games.indexOf(gameId);
    //
    //   const prevGameId = list.games[index - 1];
    //
    // TODO: push route
    // },

    // nextGame() {
    //   // TODO: account for list sorting when getting next game
    //   this.loading = true;
    //
    //
    //   const index = list.games.indexOf(gameId);
    //
    //   const nextGameId = list.games[index + 1];
    //
    // TODO: push route
    // },

    async loadSupplementalData() {
      // TODO: put in constants
      const gogCategoryId = 17;
      const steamCategoryId = 13;

      const steamPage = this.game?.websites
        ? this.game.websites.find(({ category }) => category === steamCategoryId)
        : null;

      // TODO: use regex or more elegant way to get id from url
      const steamGameId = steamPage
        ? steamPage.url.split('app/')[1].split('/')[0]
        : null;

      const gogPage = this.game?.websites
        ? this.game.websites.find(({ category }) => category === gogCategoryId)
        : null;

      const wikipediaSlug = this.wikipediaData?.url?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId).catch((e) => {});
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game.name).catch((e) => {});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
