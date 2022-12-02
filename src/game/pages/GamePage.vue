<!-- TODO: add ports -->
<!-- TODO: add franchises -->
<!-- TODO: add bundles -->
<!-- TODO: improve text contrast when dark theme or bg is on -->
<!-- TODO: load game franchises -->
<!-- TODO: integrate with twitch -->
<!-- TODO: show bundles -->
<!-- TODO: show game right away, load steam and GOG in background -->
<!-- TODO: improve caching -->
<!-- TODO: maintain background image in subpages -->
<!-- TODO: maintain game actions in subpages -->
<!-- TODO: mine data from GOG -->
<!-- TODO: optimize backdrop styling -->
<template lang="html">
  <section>
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else-if="game">
      <div v-if="backdrop" class="backdrop" :style="`background-image: url('${backdrop.url}')`" />

      <b-container>
        <portal to="pageTitle">
          <span
            v-if="showHeaderTitle"
            :class="darkTheme || hasWallpaper ? 'text-light text-outlined' : ''"
          >
            {{ game.name }}
          </span>
        </portal>

        <portal to="headerActions">
          <b-dropdown
            class="mr-2"
            variant="success"
            no-caret
          >
            <template #button-content>
              <i class="fa-solid fa-ellipsis fa-fw" />
            </template>

            <b-dropdown-item-button @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
              Add note
            </b-dropdown-item-button>
            <b-dropdown-item v-b-modal.gameTagsModal>Edit tags</b-dropdown-item>
            <b-dropdown-item v-b-modal.addRemoveGameModal>Add to list</b-dropdown-item>
          </b-dropdown>
        </portal>

        <b-row>
          <b-col
            cols="12"
            md="4"
            xl="3"
            :class="['text-center', { 'has-backdrop': backdrop }]"
          >
            <b-img
              :src="$options.getImageUrl(game)"
              :alt="game.name"
              v-b-modal.mediaModal
              rounded
              fluid
            />

            <b-button
              v-if="gameNews"
              variant="info"
              class="my-3 d-none d-md-block"
              :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }"
            >
              <b-badge>{{ gameNews.length }}</b-badge>
              Latest news
            </b-button>

            <!-- <amazon-links class="mt-2" /> -->
            <!-- <game-speedruns /> -->
            <template v-if="highlightedAchievements">
              <h4 :class="['mt-3', { 'text-outlined': hasWallpaper }]">Achievements</h4>

              <b-list-group>
                <b-list-group-item
                  class="d-flex align-items-center"
                  v-for="achievement in highlightedAchievements"
                  :key="achievement.name"
                >
                  <b-avatar
                    variant="info"
                    :src="achievement.path"
                    square
                    class="mr-2"
                  />

                  {{ achievement.name }}
                </b-list-group-item>
              </b-list-group>
              <!-- TODO: load all achievements -->
            </template>
          </b-col>

          <b-col
            cols="12"
            md="8"
            xl="9"
          >
            <article :class="darkTheme || hasWallpaper ? 'text-light' : ''">

              <div class="d-flex justify-content-between" v-b-visible="visibleHandler">
                <h2 :class="{ 'mt-3': backdrop }">{{ game.name }}</h2>
              </div>

              <game-description />

              <div v-if="gameDevelopers" class="mt-3">
                <h4>Developed by:</h4>
                <b-link
                  v-for="developer in gameDevelopers"
                  :key="developer.id"
                  :to="{ name: 'company', params: { id: developer.id }}"
                >
                  <b-img
                    v-if="developer.logo"
                    :src="$options.getImageUrl(developer)"
                    :alt="developer.name"
                    width="100"
                  />

                  <span v-else>{{ developer.name }}</span>
                </b-link>
              </div>

              <div v-if="gamePublishers" class="mt-3">
                <h4>Published by:</h4>
                <b-link
                  v-for="publisher in gamePublishers"
                  :key="publisher.id"
                  :to="{ name: 'company', params: { id: publisher.id }}"
                >
                  <b-img
                    v-if="publisher.logo"
                    :src="$options.getImageUrl(publisher)"
                    :alt="publisher.name"
                    width="100"
                  />

                  <span v-else>{{ publisher.name }}</span>
                </b-link>
              </div>

              <b-alert
                v-if="note"
                v-html="note"
                show
                class="cursor-pointer mt-3"
                variant="warning"
                @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
              />

              <div class="mt-3" v-if="alternativeNames.length">
                <p>Alternative names:</p>

                <div
                  class="mb-1 small"
                  variant="light"
                  v-for="{ comment, id, name, imgUrl } in alternativeNames"
                  :key="id"
                >
                  <b-avatar
                    v-b-tooltip.hover
                    :title="comment || null"
                    size="sm"
                    class="mr-1"
                    :src="imgUrl"
                  />

                  {{ name }}
                </div>
              </div>

              <div v-if="gamePlatforms">
                <h4>Available for:</h4>

                <b-link
                  v-for="platform in gamePlatforms"
                  :key="platform.id"
                  :to="{ name: 'search', query: { platforms: platform.id }}"
                >
                  <b-img
                    v-if="platform.platform_logo"
                    :src="$options.getImageUrl(platform.platform_logo)"
                    :alt="platform.name"
                    thumbnail
                    width="100"
                  />

                  <div v-else>
                    {{ platform.name }}
                  </div>
                </b-link>
              </div>

              <!-- <b-link v-if="!boardsWithGame.length" v-b-modal.addRemoveGameModal>
                Add to list
              </b-link> -->

              <game-ratings />
              <game-details />
            </article>

            <small
              v-if="legalNotice"
              class="text-muted"
              v-html="legalNotice"
            />
          </b-col>
        </b-row>

        <game-media />

        <section v-if="boardsWithGame.length" class="mt-3">
          <strong :class="{ 'text-outlined': hasWallpaper }">Found in: </strong>

          <b-form-row>
            <!-- TODO: highlight game when linking back to board -->
            <b-col
              v-for="board in boardsWithGame"
              :key="board.id"
              class="mb-2"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <mini-board
                :board="board"
                @click.native="$router.push({ name: 'board', params: { id: board.id } })"
              />
            </b-col>
          </b-form-row>
        </section>
        <!-- <timeline
          v-if="twitterHandle"
          :id="twitterHandle"
          sourceType="profile"
        >
          loading...
        </timeline> -->
      </b-container>

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
  </section>
</template>

<script>
import { setPageTitle } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';
// import AmazonLinks from '@/components/Game/AmazonLinks';
import GameDetails from '@/components/Game/GameDetails';
import GameMedia from '@/components/Game/GameMedia';
import GameRatings from '@/components/Game/GameRatings';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import MiniBoard from '@/components/Board/MiniBoard';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, TWITTER_CATEGORY_ID, IMAGE_SIZE_SCREENSHOT_HUGE } from '@/constants';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    MiniBoard,
    // AmazonLinks,
    GameDescription,
    GameDetails,
    GameMedia,
    GameRatings,
    // GameSpeedruns,
    SimilarGames,
  },

  data() {
    return {
      loading: false,
      showHeaderTitle: false,
      hasWallpaper: false,
    };
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags', 'boards', 'user', 'notes', 'twitchToken']),
    ...mapGetters(['darkTheme', 'gameNews']),

    boardsWithGame() {
      return this.boards?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(this.game?.id))) || [];
    },

    gameDevelopers() {
      return this.game?.involved_companies
        ?.filter(({ developer }) => developer)
        ?.map(({ company }) => company) || null;
    },

    gamePublishers() {
      return this.game?.involved_companies
        ?.filter(({ publisher }) => publisher)
        ?.map(({ company }) => company) || null;
    },

    gamePlatforms() {
      return this.game?.platforms;
    },

    backdrop() {
      const artwork = this.game?.artworks?.[0];

      if (!artwork) return null;

      return {
        height: artwork.height,
        width: artwork.width,
        url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
      }
    },

    metacriticScore() {
      return this.game?.steam?.metacritic;
    },

    alternativeNames() {
      return this.game?.alternative_names?.map(({ comment, name, id }) => {

        return {
          comment,
          imgUrl: `/img/country-flags/${this.getCountryCode(comment)}.svg`,
          name,
          id,
        }
      }) || [];
    },

    originBoardId() {
      return this.$route?.params?.boardId;
      return this.$route?.params?.boardId;
    },

    highlightedAchievements() {
      return this.game?.steam?.achievements?.highlighted;
    },

    note() {
      return this.notes[this.game?.id] || null;
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

    gameId() {
      return this.$route.params.id;
    },
  },

  watch: {
    gameId(gameId) {
      if (gameId) this.loadGame();
    },
  },

  async mounted() {
    if (!this.twitchToken) return this.waitAndLoadGame();

    this.loadGame();
  },

  methods: {
    getCountryCode(alternateTitleDescription) {
      if (!alternateTitleDescription) return 'un';

      const description = alternateTitleDescription.toLowerCase();

      if (description.includes('japanese')) return 'jp';
      if (description.includes('korean')) return 'kr';
      if (description.includes('portuguese')) return 'pt';
      if (description.includes('brazilian')) return 'br';
      if (description.includes('spanish')) return 'es';
      if (description.includes('french')) return 'fr';
      if (description.includes('italian')) return 'it';
      if (description.includes('arabic')) return 'sa';
      if (description.includes('polish')) return 'pl';
      if (description.includes('russian')) return 'ru';
      if (description.includes('chinese')) return 'cn';
      if (description.includes('german')) return 'de';
      if (description.includes('dutch')) return 'nl';
      if (description.includes('european')) return 'eu';

      return 'un';
    },

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
      if (url?.includes('igdb.com')) return url;

      const wallpaper = this.wallpapers?.find(({ fullPath }) => fullPath === url);

      return wallpaper?.url ? decodeURI(wallpaper.url) : '';
    },

    visibleHandler(visible) {
      this.showHeaderTitle = !visible;
    },

    async loadGame() {
      this.loading = true;
      this.$bus.$emit('CLEAR_WALLPAPER');
      this.$store.commit('CLEAR_GAME');

      await this.$store.dispatch('LOAD_GAME', this.gameId).catch(() => {});

      setPageTitle(this.game?.name);

      this.loading = false;

      this.loadArtworks();

      const steamUrl = this.game?.websites?.find(({ category }) => category === STEAM_CATEGORY_ID)?.url;
      const steamGameId = steamUrl?.split('app/')[1]?.split('/')[0];

      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId).catch((e) => {});

      const gogPage = this.game?.websites?.find(({ category }) => category !== GOG_CATEGORY_ID);
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game?.name).catch((e) => {});

      const wikipediaSlug = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA)?.url?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', steamGameId).catch((e) => {});
      if (this.game?.steam?.background) {
        this.$bus.$emit('UPDATE_WALLPAPER', this.game?.steam?.background)
        this.hasWallpaper = Boolean(this.game?.steam?.background);
      };

      this.loading = false;
    },

    async loadArtworks() {
      const artworks = await this.$store.dispatch('IGDB', { path: 'artworks', data: `fields *; where game = ${this.game.id}; limit 20;` });

      if (artworks) this.$store.commit('APPEND_GAME_ARTWORKS', artworks);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.backdrop {
  margin-top: -54px;
  background-size: cover;
  height: 50vh;
}

.has-backdrop {
  margin-top: -25vh;
}
</style>
