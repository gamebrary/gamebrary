<!-- TODO: integrate with twitch -->
<!-- TODO: show bundles -->
<!-- TODO: show game right away, load steam and GOG in background -->
<!-- TODO: improve caching -->
<!-- TODO: maintain background image in subpages -->
<!-- TODO: maintain game actions in subpages -->
<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <template v-else-if="game">
        <portal to="pageTitle">
          <b-button
            v-if="originBoardId"
            :to="{ name: 'board', params: { id: originBoardId } }"
            variant="light"
            class="mr-2"
          >
            <i class="fa-solid fa-chevron-left" />
          </b-button>
        </portal>

        <b-form-row>
          <b-col
            cols="12"
            md="4"
            xl="3"
          >
            <b-img
              :src="gameCoverUrl"
              :alt="game.name"
              rounded
              fluid
            />

            <game-note
              v-if="note"
              :note="note"
              class="cursor-pointer mt-3 d-none d-md-block"
              @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
            />

            <b-button
              v-else
              size="sm"
              variant="warning"
              :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug } }"
              class="mt-2"
            >
              Add note
            </b-button>

            <b-button
              v-if="gameNews.length"
              size="sm"
              class="mt-2 ml-2"
              :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }"
            >
              <b-badge>{{ gameNews.length }}</b-badge>
              Latest news
            </b-button>

            <!-- <amazon-links class="mt-2" /> -->

            <game-in-list :class="{ 'text-white': hasWallpaper }" />

            <!-- <game-speedruns /> -->

            <!-- <div v-if="gameAchievements"> -->
              <!-- <pre>{{ gameAchievements }}</pre> -->
            <!-- </div> -->
          </b-col>

          <b-col
            cols="12"
            md="8"
            xl="9"
          >
            <article :class="[' rounded', hasWallpaper ? 'bg-white mt-2 mt-md-0 p-3' : 'px-sm-3 p-0']">
              <div class="d-flex justify-content-between">
                <game-titles />

                <b-link
                  class="align-self-end ml-2 small"
                  :to="{ name: 'game.progress', params: { id: game.id, slug: game.slug } }"
                >
                  <template v-if="progress > 0">
                    {{ progress }}% completed
                  </template>

                  <template v-else>
                    Set progress
                  </template>
                </b-link>
              </div>

              <template v-if="tagsApplied.length">
                <b-button
                  v-for="({ bgColor, textColor, name, index }) in tagsApplied"
                  :key="name"
                  rounded
                  size="sm"
                  variant="transparent"
                  class="mr-1 mb-2"
                  :style="`background-color: ${bgColor}; color: ${textColor}`"
                  :to="{ name: 'tag.edit', params: { id: index } }"
                >
                  <i class="fa-solid fa-tag mr-1" />
                  {{ name }}
                </b-button>

              </template>

              <game-tags-dropdown v-if="user" />

              <aside class="supplemental-info bg-white field float-right ml-5 pb-2">
                <game-details />
              </aside>

              <game-description />
              <game-media-viewer />
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
  </section>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';
// import AmazonLinks from '@/components/Game/AmazonLinks';
import GameDetails from '@/components/Game/GameDetails';
import GameTagsDropdown from '@/components/Game/GameTagsDropdown';
import GameMediaViewer from '@/components/Game/GameMediaViewer';
import GameTitles from '@/components/Game/GameTitles';
import GameRatings from '@/components/Game/GameRatings';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameInList from '@/components/Game/GameInList';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import GameNote from '@/components/GameNote';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, TWITTER_CATEGORY_ID } from '@/constants';

export default {
  components: {
    // AmazonLinks,
    GameNote,
    GameDescription,
    GameDetails,
    GameTagsDropdown,
    GameTitles,
    GameMediaViewer,
    GameRatings,
    // GameSpeedruns,
    SimilarGames,
    GameInList,
  },

  data() {
    return {
      loading: false,
      hasWallpaper: false,
    };
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags', 'boards', 'user', 'notes', 'twitchToken']),

    metacriticScore() {
      return this.game?.steam?.metacritic;
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

    originBoardId() {
      return this.$route?.params?.boardId;
    },

    // gameAchievements() {
    //   return this.game?.steam?.achievements || [];
    // },

    note() {
      return this.notes[this.game?.id] || null;
    },

    tagsApplied() {
      if (!this.tags) return [];

      return this.tags?.map((tag, index) => ({ ...tag, index }))
        .filter((tag) => tag?.games?.includes(this.game?.id));
    },

    legalNotice() {
      return this.game?.steam?.legal_notice;
    },

    // twitterHandle() {
    //   const twitterUrl = this.game?.websites?.find(({ category }) => category === TWITTER_CATEGORY_ID);
    //
    //   return twitterUrl?.url
    //     ? twitterUrl.url.split('twitter.com/')[1]
    //     : null;
    // },

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
      if (gameId) this.loadGame();
    },
  },

  async mounted() {
    if (!this.twitchToken) return this.waitAndLoadGame();

    if (!this.tags) {
      await this.$store.dispatch('LOAD_TAGS');
    }
    this.loadGame();
  },

  methods: {
    waitAndLoadGame() {
      this.loading = true;

      setTimeout(() => {
        if (!this.twitchToken) {
          this.waitAndLoadGame();
        } else {
          this.loadGame();
        }
      }, 500);
    },

    getWallpaperUrl(url) {
      if (!url) return '';
      if (url && url.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers?.find(({ fullPath }) => fullPath === url);

      return wallpaper && wallpaper.url ? decodeURI(wallpaper.url) : '';
    },

    async loadGame() {
      // const gameCached = this.game?.id === this.gameId;

      // if (!this.gameId || gameCached) return;
      this.loading = true;
      // this.$bus.$emit('CLEAR_WALLPAPER');
      this.$store.commit('CLEAR_GAME');

      await this.$store.dispatch('LOAD_GAME', this.gameId).catch(() => {});

      this.loading = false;

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
      if (this.game?.steam?.background) {
        this.$bus.$emit('UPDATE_WALLPAPER', this.game?.steam?.background)
        this.hasWallpaper = Boolean(this.game?.steam?.background);
      };

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

.supplemental-info {
  width: 40%;

  @media(max-width: 780px) {
    width: 100%;
  }
}
</style>
