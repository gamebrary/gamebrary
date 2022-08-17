<!-- TODO: add bundles to game detail? -->
<!-- {{ game.bundles ? `Found in ${game.bundles.length} compilations.` : null }} -->
<!-- TODO: add speedruns -->
<!-- TODO: Highlight exclusive games (e.g. only for NSW) -->
<!-- TODO: add pricecharting info -->
<!-- TODO: show GOG buy button -->
<!-- TODO: Show lists/boards that the game belongs to -->

<template lang="html">
  <b-container fluid>
    <portal to="pageTitle" v-if="game">{{ game.name }}</portal>

    <div v-if="loading" class="text-center mt-5 ml-auto">
      <b-spinner/>
    </div>

    <template v-else-if="game">
      <game-media-modal />

      <b-row>
        <b-col
          cols="12"
          sm="6"
          md="4"
          xl="3"
        >
          <div class="position-relative cursor-pointer" v-b-modal.mediaModal>
            <i class="fa-solid fa-play play-button color-white text-white font-size-xl" />

            <b-img
              :src="gameCoverUrl"
              :alt="game.name"
              rounded
              fluid
            />
          </div>

          <b-img
            v-b-modal.mediaModal
            :src="gameHeaderImage"
            fluid
          />

          <!-- <amazon-links class="mt-2" /> -->

          <!-- <div class="game-info">
            <game-rating :game="game" />
          </div> -->

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

          <div class="notes mt-3">
            <game-note
              v-if="note"
              :note="note"
              class="cursor-pointer"
              @click.native="$router.push({ name: 'game.notes', params: { id: game.id } })"
            />
          </div>

          <b-button
            v-if="gameNews.length"
            :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }"
            variant="light"
          >
            <i class="fa-solid fa-newspaper fa-fw" />
            <span class="d-none d-lg-inline">News</span>
          </b-button>

          <game-in-list />

          <!-- <div v-if="gameAchievements"> -->
            <!-- TODO: add steam achievements -->
            <!-- <pre>{{ gameAchievements }}</pre> -->
          <!-- </div> -->
        </b-col>

        <b-col
          cols="12"
          sm="6"
          xl="9"
        >
          <article class="bg-light rounded p-3">
            <header class="d-flex align-items-start justify-content-between pb-2">
              <game-titles />

              <aside>
                <b-button
                  variant="light"
                  pill
                  @click="$router.push({ name: 'game.progress', params: { id: game.id, slug: game.slug } })"
                >
                  {{ progress || 0 }}%
                </b-button>

                <b-button
                  variant="warning" :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug } }"
                  class="mr-2"
                >
                  <i class="fa-solid fa-note-sticky fa-fw" />
                </b-button>

                <b-button
                  variant="light" @click="$bus.$emit('ADD_GAME', game.id)"
                  class="mr-2"
                >
                  <i class="fa-solid fa-plus fa-fw" />
                  <span class="d-none d-lg-inline">Add to list</span>
                </b-button>


                <!-- <b-button :href="metacriticScore.url" variant="success" v-if="metacriticScore.url">
                  {{ metacriticScore.score }}

                </b-button> -->
              </aside>
            </header>

            <b-button
              v-if="!tagsApplied.length"
              rounded
              variant="light"
              class="mb-2"
              @click="$router.push({ name: 'game.tags', params: { id: game.id, slug: game.slug } })"
            >
              Tag
            </b-button>

            <b-button
              v-for="({ bgColor, textColor, name }) in tagsApplied"
              :key="name"
              rounded
              size="sm"
              variant="transparent"
              class="mr-1 my-2"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              @click="$router.push({ name: 'game.tags', params: { id: game.id, slug: game.slug } })"
            >
              {{ name }}
            </b-button>

            <aside class="bg-white float-right pl-2 pb-2">
              <b-img
                v-b-modal.mediaModal
                :src="gameScrenshot"
                thumbnail
                width="320"
              />

              <game-websites />
            </aside>

            <game-description />
            <game-details />


            <b-card-footer v-if="legalNotice">
              <small class="text-muted" v-html="legalNotice" />
            </b-card-footer>

            <!-- TODO: use speedrun logo -->
            <!-- <pre>{{ game}}</pre> -->
            <!-- <b-card-img src="https://placekitten.com/480/210" alt="Image" bottom></b-card-img> -->
          </article>
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

      <b-row>
        <b-col>
          <similar-games />
        </b-col>
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
// import AmazonLinks from '@/components/Game/AmazonLinks';
import GameDetails from '@/components/Game/GameDetails';
import GameMediaModal from '@/components/Game/GameMediaModal';
import GameTitles from '@/components/Game/GameTitles';
// import GameRating from '@/components/Game/GameRating';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameInList from '@/components/Game/GameInList';
import GameWebsites from '@/components/Game/GameWebsites';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import GameNote from '@/components/GameNote';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID } from '@/constants';

export default {
  components: {
    // Timeline,
    // AmazonLinks,
    GameNote,
    GameDescription,
    GameDetails,
    GameTitles,
    GameMediaModal,
    // GameRating,
    GameWebsites,
    // GameSpeedruns,
    SimilarGames,
    GameInList,
  },

  data() {
    return {
      loading: false,
    };
  },

  beforeDestroy() {
    // TODO: only clear board if game being viewed is not in current board
    // if (!['game', 'board'].includes(this.$route.name)) {
      // this.$store.commit('CLEAR_BOARD');
    // }
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags', 'boards', 'user', 'notes']),

    metacriticScore() {
      return this.game?.steam?.metacritic || {};
    },

    gameNews() {
      return this.game?.news || [];
    },

    // gameAchievements() {
    //   return this.game?.steam?.achievements || [];
    // },

    note() {
      return this.notes[this.game?.id] || null;
    },

    tagsApplied() {
      return this.tags?.filter((tag) => tag?.games?.includes(this.game?.id))
    },

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

    gameHeaderImage() {
      return this.game?.steam?.header_image;
    },
  },

  watch: {
    gameId(gameId) {
      // document.getElementsByTagName('main')[0].scrollTop = 0;

      if (gameId) this.loadGame();
      // TODO: handle missing id, redirect? 404? search?
    },
  },

  mounted() {
    // TODO: wait for access token
    this.$bus.$emit('UPDATE_WALLPAPER', null);
    this.loadGame();

    this.$store.dispatch('IGDB', { path: 'game_modes', data: 'fields *;' });
  },

  methods: {
    getWallpaperUrl(url) {
      if (!url) return '';
      if (url && url.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers?.find(({ fullPath }) => fullPath === url);

      return wallpaper && wallpaper.url ? decodeURI(wallpaper.url) : '';
    },

    async loadGame() {
      const gameCached = this.game?.id === this.gameId;

      if (!this.gameId || gameCached) return;

      this.loading = true;
      this.$store.commit('CLEAR_GAME');
      this.$bus.$emit('UPDATE_WALLPAPER', null);
      this.$store.dispatch('LOAD_TAGS');

      await this.$store.dispatch('LOAD_GAME', this.gameId)
        .catch(() => {
          this.loading = false;

          return;
          // this.$bvToast.toast('Error loading game', { variant: 'error' });
        });

      const steamData = this.game?.websites?.find(({ category }) => category === STEAM_CATEGORY_ID);

      // TODO: use regex or more elegant way to get id from url
      const steamGameId = steamData?.url?.split('app/')[1]?.split('/')[0];
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId).catch((e) => {});

      // TODO: find more precise way to load GOG game, based on id?
      const gogPage = this.game?.websites?.find(({ category }) => category !== GOG_CATEGORY_ID);
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game.name).catch((e) => {});

      // const wikipediaData = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);
      const wikipediaSlug = this.game?.websites
        ?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA)
        ?.url
        ?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', steamGameId).catch((e) => {});

      console.log('this.game?.steam?.background', this.game?.steam?.background);

      if (this.game?.steam?.background) this.$bus.$emit('UPDATE_WALLPAPER', this.game?.steam?.background);

      this.loading = false;
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.board-thumbnail {
  background-size: cover;
  background-position: center;
}

article {
  background: red;
  min-height: 50vh;
}

.play-button {
  background-color:rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  left: calc(50% - 50px);
  font-size: 2rem;
  top: calc(50% - 25px);
}
</style>
