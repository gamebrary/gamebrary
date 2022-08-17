<!-- TODO: Highlight exclusive games (e.g. only for NSW) -->
<!-- TODO: add pricecharting info -->
<!-- TODO: show GOG buy button -->
<template lang="html">
  <b-container fluid>
    <!-- <portal to="pageTitle" v-if="game">{{ game.name }}</portal> -->

    <!-- <portal to="pageTitle" v-if="game">
      <b-button>
        boom
      </b-button>
    </portal> -->

    <div v-if="loading" class="text-center mt-5 ml-auto">
      <b-spinner/>
    </div>

    <template v-else-if="game">
      <game-media-modal />

      <b-form-row>
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

          <section
            v-if="gameNews.length"
            tag="a"
            class="bg-light rounded px-2 mt-2 d-flex flex-column"
          >
            <h5 class="pt-2">Latest news:</h5>

            <router-link
              v-for="article in gameNews"
              :key="article.gid"
              :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }"
              class="d-flex mb-2"
            >
              <b-img
                :src="article.imageUrl"
                width="100"
                :blank="!article.imageUrl"
                rounded
                class="float-left mr-2"
              />

              <small class="pr-2">{{ article.title }}</small>
            </router-link>
          </section>

          <!-- <amazon-links class="mt-2" /> -->

          <!-- <pre class="text-dark small">{{ game.gog.price }}</pre> -->

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
              @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
            />
          </div>

          <game-in-list />

          <!-- <game-speedruns /> -->

          <!-- <div v-if="gameAchievements"> -->
            <!-- TODO: add steam achievements -->
            <!-- <pre>{{ gameAchievements }}</pre> -->
          <!-- </div> -->
        </b-col>

        <b-col
          cols="12"
          sm="6"
          md="8"
          xl="9"
        >
          <article class="bg-white rounded px-3 pt-3 pb-1">
            <header class="d-flex align-items-start justify-content-between pb-2">
              <game-titles />

              <aside>
                <b-button
                  v-if="!tagsApplied.length"
                  rounded
                  variant="light"
                  size="sm"
                  class="mr-1"
                  @click="$router.push({ name: 'game.tags', params: { id: game.id, slug: game.slug } })"
                >
                  Tag
                </b-button>

                <b-button
                  variant="light"
                  size="sm"
                  class="mr-1"
                  @click="$router.push({ name: 'game.progress', params: { id: game.id, slug: game.slug } })"
                >
                  {{ progress || 0 }}%
                </b-button>

                <b-button
                  size="sm"
                  variant="warning" :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug } }"
                  class="mr-1"
                >
                  <i class="fa-solid fa-note-sticky fa-fw" />
                </b-button>

                <b-button
                  size="sm"
                  variant="light" @click="$bus.$emit('ADD_GAME', game.id)"
                  class="mr-1"
                >
                  <i class="fa-solid fa-plus fa-fw" />
                </b-button>

                <!-- <b-button :href="metacriticScore.url" variant="success" v-if="metacriticScore.url">
                  {{ metacriticScore.score }}

                </b-button> -->
              </aside>
            </header>

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

            <b-img
              v-b-modal.mediaModal
              :src="gameHeaderImage"
              fluid
            />

            <game-details />
            <game-ratings />

          </article>

          <small
            v-if="legalNotice"
            class="text-muted"
            v-html="legalNotice"
          />
        </b-col>
      </b-form-row>

      <similar-games />
    </template>

    <div class="pt-5" v-else>
      <div class="d-flex justify-content-center align-items-center" id="main">
        <h1 class="mr-3 pr-3 align-top border-right inline-block align-content-center">404</h1>
        <div class="inline-block align-middle">
          <h2 class="font-weight-normal lead" id="desc">Game was not found.</h2>
        </div>
      </div>
    </div>

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
import GameRatings from '@/components/Game/GameRatings';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameInList from '@/components/Game/GameInList';
import GameWebsites from '@/components/Game/GameWebsites';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import GameNote from '@/components/GameNote';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID } from '@/constants';

export default {
  components: {
    // AmazonLinks,
    GameNote,
    GameDescription,
    GameDetails,
    GameTitles,
    GameMediaModal,
    GameRatings,
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
      const news = this.game?.news?.map((article) => {
        const imageUrlExpression = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        const regex = new RegExp(imageUrlExpression);
        const imageUrl = article?.contents?.match(regex)?.[0];

        return {
          title: article.title,
          imageUrl,
        }
      }) || [];

      return news.length > 3
        ? news.splice(0, 3)
        : news;
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

      this.$bus.$emit('UPDATE_WALLPAPER', null);
      this.loading = true;
      this.$store.commit('CLEAR_GAME');
      this.$store.dispatch('LOAD_TAGS');

      await this.$store.dispatch('LOAD_GAME', this.gameId)
        .catch(() => {
          return this.loading = false;
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
      if (this.game?.steam?.background) this.$bus.$emit('UPDATE_WALLPAPER', this.game?.steam?.background);

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-cover {
  width: 100%;
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
