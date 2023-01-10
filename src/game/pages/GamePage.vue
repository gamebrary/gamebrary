<!-- TODO: show igdb tags? -->
<!-- TODO: add ports -->
<!-- TODO: load game franchises -->
<!-- TODO: integrate with twitch -->
<!-- TODO: improve caching, show game right away, load steam and GOG in background -->
<!-- TODO: maintain background image in subpages -->
<!-- TODO: maintain game actions in subpages -->
<!-- TODO: mine data from GOG -->
<template lang="html">
  <section
    :class="[{ 'text-light': darkTheme && hasWallpaper, 'offset-background': hasArtworks }, 'game-page']"
    :style="background && this.darkTheme ? `background-image: url(${background})` : ''"
  >
    <game-header />
    <add-remove-game />


    <b-container>
      <portal to="pageTitle">
        <h3
          v-show="showHeaderTitle"
          :class="darkTheme && hasWallpaper ? 'text-light text-outlined' : ''"
        >
          {{ gameName }}
        </h3>
      </portal>

      <b-row>
        <b-col
          cols="12"
          md="4"
          xl="3"
          style="z-index: 1"
          :class="['text-center', { 'has-artworks': hasArtworks }]"
        >
          <b-img
            :src="$options.getImageUrl(cachedGame)"
            :alt="gameName"
            v-b-modal.mediaModal
            rounded
            fluid
          />

          <game-media />

          <div v-if="gameRemakes" class="text-left mt-2">
            <strong>Remakes</strong>

            <router-link
              v-for="remake in gameRemakes"
              :key="remake.id"
              :to="{ name: 'game', params: { id: remake.id, slug: remake.slug } }"
            >
              <b-img
                :src="$options.getImageUrl(remake)"
                :alt="remake.name"
                rounded
                fluid
              />
            </router-link>
          </div>

          <div v-if="gameRemasters" class="text-left mt-2">
            <strong>Remasters</strong>

            <router-link
              v-for="remaster in gameRemasters"
              :key="remaster.id"
              :to="{ name: 'game', params: { id: remaster.id, slug: remaster.slug } }"
            >
              <b-img
                :src="$options.getImageUrl(remaster)"
                :alt="remaster.name"
                rounded
                fluid
              />
            </router-link>
          </div>

          <div
            v-if="newsHighlights"
            class="position-relative"
          >
            <div
              class="news-ticker"
              v-b-tooltip.hover
              title="Latest news"
            >
              <ul class="news-list" :data-length="newsHighlights.length">
                <li
                  v-for="(highlight, index) in newsHighlights"
                  :key="index"
                  class="d-flex align-items-center news"
                >
                  <b-link
                    class="text-truncate"
                    :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }"
                  >
                    {{ highlight}}
                  </b-link>
                </li>
              </ul>
            </div>
          </div>

          <!-- <amazon-links class="mt-2" /> -->
          <!-- <template v-if="highlightedAchievements">
            <h3 :class="['mt-5', { 'text-outlined': hasWallpaper }]">Achievements</h3>

            <b-list-group>
              <b-list-group-item
                class="d-flex align-items-center"
                variant="secondary"
                v-for="achievement in highlightedAchievements"
                :key="achievement.name"
              >
                <b-avatar
                  variant="info"
                  :src="achievement.path"
                  square
                  size="24"
                  class="mr-2"
                />

                {{ achievement.name }}
              </b-list-group-item>
            </b-list-group>
          </template> -->
          <!-- TODO: load all achievements -->
        </b-col>

        <b-col
          cols="12"
          md="8"
          lg="5"
          xl="6"
          class="pt-3"
        >
          <div class="d-flex justify-content-between" v-b-visible="visibleHandler">
            <h2 :class="['mb-0', { 'mt-3': hasArtworks }]">
              {{ gameName }}
            </h2>
          </div>

          <b-badge v-if="gameCategory" variant="info" class="mb-2">
            {{ gameCategory }}
          </b-badge>

          <div :class="['game-description', source]">
            <b-spinner v-if="loading" class="spinner-centered" />

            <template v-else>
              <div v-html="description" />
              <game-ratings />
              <!-- TODO: use logos for listing all sources -->
              <span class="text-muted mt-n3 mb-3 text-capitalize">Source: {{ source }}</span>

              <b-row class="mt-3">
                <b-col cols="12" v-if="gamePlatforms">
                  <h4 class="mb-1">Available for:</h4>

                  <b-link
                    v-for="platform in gamePlatforms"
                    :key="platform.id"
                    :to="{ name: 'search', query: { filterBy: 'platforms', value: platform.id }}"
                    v-b-tooltip.hover
                    :title="platform.name"
                    :class="['p-2 d-inline-flex rounded mr-2 mb-2', { 'bg-white': platform.platform_logo && platform.platform_logo.alpha_channel }]"
                  >
                    <b-img
                      :src="$options.getImageUrl(platform.platform_logo)"
                      :alt="platform.name"
                      width="60"
                    />
                  </b-link>
                </b-col>

                <b-col cols="4" v-if="alternativeNames.length">
                  <h4 class="mb-1">Alternative names:</h4>

                  <div
                    class="mb-1"
                    variant="light"
                    v-for="{ comment, id, name, imgUrl } in alternativeNames"
                    :key="id"
                  >
                    <b-avatar
                      v-b-tooltip
                      :title="comment || null"
                      size="sm"
                      variant="transparent"
                      class="mr-1"
                      rounded
                      :src="imgUrl"
                    />

                    {{ name }}
                  </div>
                </b-col>

                <b-col cols="4" v-if="gamePublishers.length">
                  <h4 class="mb-1">Published by:</h4>

                  <b-link
                    v-for="publisher in gamePublishers"
                    :key="publisher.id"
                    :to="{ name: 'company', params: { id: publisher.id, slug: publisher.slug }}"
                    :class="['p-2 d-inline-flex rounded mr-2 mb-2', { 'bg-white': publisher.logo && publisher.logo.alpha_channel }]"
                  >
                    <b-img
                      v-if="publisher.logo"
                      :src="$options.getImageUrl(publisher)"
                      :alt="publisher.name"
                      width="120"
                    />

                    <span v-else>{{ publisher.name }}</span>
                  </b-link>
                </b-col>

                <b-col cols="4" v-if="gameDevelopers.length">
                  <h4 class="mb-1">Developed by:</h4>

                  <b-link
                    v-for="developer in gameDevelopers"
                    :key="developer.id"
                    :to="{ name: 'company', params: { id: developer.id, slug: developer.slug }}"
                    :class="['p-2 d-inline-flex rounded mr-2 mb-2', { 'bg-white': developer.logo && developer.logo.alpha_channel }]"
                  >
                    <b-img
                      v-if="developer.logo"
                      :src="$options.getImageUrl(developer)"
                      :alt="developer.name"
                      width="120"
                    />

                    <span v-else>{{ developer.name }}</span>
                  </b-link>
                </b-col>
              </b-row>
            </template>
          </div>

          <!-- <game-speedruns /> -->
        </b-col>

        <b-col
          cols="12"
          md="12"
          lg="3"
          xl="3"
          class="pt-3"
        >
          <b-alert
            v-if="note"
            v-html="note"
            show
            class="cursor-pointer mt-3"
            variant="warning"
            @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
          />

          <game-progress />

          <div v-if="gameGenres">
            <h4 class="mt-4">Genres: </h4>

            <b-link
              v-for="(genre, index) in gameGenres"
              :to="{ name: 'search', query: { filterBy: 'genres', value: genre.id }}"
              :key="genre.id"
            >
              {{ genre.name }}<template v-if="index < gameGenres.length - 1">, </template>
            </b-link>
          </div>

          <div v-if="gameThemes">
            <h4 class="mt-4">Themes: </h4>

            <b-link
              v-for="({ id, name }, index) in gameThemes"
              :key="id"
            >
              <b-link :to="{ name: 'search', query: { filterBy: 'themes', value: id }}">{{ name }}</b-link>
              <template v-if="index < gameThemes.length - 1">, </template>
            </b-link>
          </div>

          <div v-if="gameEngines">
            <h4 class="mt-4">Game engines: </h4>

            <!-- TODO: link and add filter -->
            <p
              v-for="{ id, name } in gameEngines"
              :key="id"
              :class="darkTheme && hasWallpaper ? 'text-light' : ''"
            >
              {{ name }}
            </p>
          </div>

          <div v-if="gameModes">
            <h4 class="mt-4">{{ $t('board.gameModal.gameModes') }}: </h4>

            <b-link
              v-for="(gameMode, index) in gameModes"
              :key="gameMode.id"
            >
              <b-link :to="{ name: 'search', query: { filterBy: 'game_modes', value: gameMode.id }}">{{ gameMode.name }}</b-link>
              <template v-if="index < gameModes.length - 1">, </template>
            </b-link>
          </div>

          <div v-if="playerPerspectives">
            <h4 class="mt-4">{{ $t('board.gameModal.perspective') }}: </h4>

            <b-link
              v-for="({ id, name }, index) in playerPerspectives"
              :key="id"
            >

              <b-link :to="{ name: 'search', query: { filterBy: 'player_perspectives', value: id }}">{{ name }}</b-link>
              <template v-if="index < playerPerspectives.length - 1">, </template>
            </b-link>
          </div>

          <!-- TODO: restore release dates -->
          <!-- <div>
            <h4 class="mt-4">{{ $t('board.gameModal.releaseDate') }}</h4>
            <ol v-if="releaseDates" class="list-unstyled mb-0">
              <li
                v-for="{ id, platform, date } in releaseDates"
                :key="id"
              >
                {{ date }} <span>{{ platform || 'N/A' }}</span>
              </li>
            </ol>

            <div v-else>
              Not released yet
            </div>
          </div> -->

          <div v-if="user">
            <h4 class="mt-4">Tags: </h4>

            <b-link v-if="!tagsApplied.length" v-b-modal.gameTagsModal>
              Add tag
            </b-link>

            <b-button
              v-for="({ bgColor, textColor, name, index }) in tagsApplied"
              :key="index"
              size="sm"
              variant="transparent"
              class="mr-2 mb-2"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              v-b-modal.gameTagsModal
            >
              <i class="fa-solid fa-tag mr-1" />
              {{ name }}
            </b-button>

            <game-tags-modal />
          </div>

          <template v-if="gameLinks.length">
            <h4 class="mt-4">External links</h4>

            <b-button
              v-for="({ url, id, icon, svg }, index) in gameLinks"
              :href="url"
              :key="index"
              :title="$t(`board.gameModal.links.${id}`)"
              v-b-tooltip
              variant="transparent"
              target="_blank"
              class="text-left p-1 m-0"
            >
              <i
                v-if="icon"
                :class="`${icon} fa-fw`"
                aria-hidden
              />

              <b-img
                v-else-if="svg"
                width="24"
                class="mr-1"
                :src="`/logos/companies/${id}.svg`"
              />
            </b-button>
          </template>
        </b-col>
      </b-row>

      <small
        v-if="legalNotice"
        class="text-muted mt-2"
        v-html="legalNotice"
      />

      <game-in-boards />

      <div v-if="gameBundles" class="text-left mt-3">
        <h4>{{ gameName }} is included in the following bundles:</h4>

        <div class="game-grid">
          <router-link
            v-for="bundle in gameBundles"
            :key="bundle.id"
            :to="{ name: 'game', params: { id: bundle.id, slug: bundle.slug } }"
          >
            <b-img
              :src="$options.getImageUrl(bundle)"
              :alt="bundle.name"
              rounded
              fluid
            />
          </router-link>
        </div>
      </div>

      <game-collection />
      <similar-games />

      <!-- <timeline
        v-if="twitterHandle"
        :id="twitterHandle"
        sourceType="profile"
      >
        loading...
      </timeline> -->
    </b-container>

    <div v-if="!loading && !game" class="pt-5">
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
import { WEBSITE_CATEGORIES, GAME_CATEGORIES } from '@/constants';
// import AmazonLinks from '@/components/Game/AmazonLinks';
// import GameDetails from '@/components/Game/GameDetails';
import GameMedia from '@/components/Game/GameMedia';
import GameInBoards from '@/components/Game/GameInBoards';
import GameProgress from '@/components/Game/GameProgress';
import GameTagsModal from '@/components/Game/GameTagsModal';
import GameCollection from '@/components/Game/GameCollection';
import GameHeader from '@/components/Game/GameHeader';
import GameRatings from '@/components/Game/GameRatings';
import AddRemoveGame from '@/components/AddRemoveGame';
import SimilarGames from '@/components/Game/SimilarGames';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, TWITTER_CATEGORY_ID, IMAGE_SIZE_SCREENSHOT_HUGE, IGDB_QUERIES } from '@/constants';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameTagsModal,
    GameCollection,
    GameHeader,
    GameProgress,
    // AmazonLinks,
    // GameDetails,
    GameMedia,
    GameInBoards,
    GameRatings,
    // GameSpeedruns,
    SimilarGames,
    AddRemoveGame,
  },

  data() {
    return {
      loading: false,
      showHeaderTitle: false,
      wikipediaDescription: null,
    };
  },

  computed: {
    ...mapState(['game', 'games', 'progresses', 'tags', 'boards', 'user', 'notes', 'twitchToken']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks']),

    description() {
      return this.wikipediaExtract || this.steamDescription || this.igdbDescription;
    },

    background() {
      return this.game?.steam?.background;
    },

    newsHighlights() {
      return this.gameNews?.slice(0, 5)?.map(({ title }) => title?.slice(0, 50));
    },

    source() {
      if (this.wikipediaExtract) return 'wikipedia';
      if (this.steamDescription) return 'steam';

      return 'IGDB';
    },

    steamDescription() {
      return this.game?.steam?.about_the_game || this.game?.steam?.short_description;
    },

    igdbDescription() {
      return this.game?.summary;
    },

    wikipediaExtract() {
      const pages = this.wikipediaDescription?.query?.pages;

      if (!pages) return;

      const [key] = Object.keys(pages);
      const { extract } = pages[key];

      return extract || null;
    },

    wikipediaSlug() {
      const wikipediaData = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);

      return wikipediaData?.url?.split('/wiki/')?.[1];
    },

    tagsApplied() {
      const tags = this.tags?.tags || this.tags;

      if (!tags) return [];

      return tags?.map((tag, index) => ({ ...tag, index }))
        ?.filter((tag) => tag?.games?.includes(this.game?.id));
    },

    boardsWithGame() {
      return this.boards?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(this.game?.id))) || [];
    },

    // TODO: find a good use for game header image
    // gameHeaderImage() {
    //   return this.game?.steam?.header_image;
    // },

    officialWebsiteUrl() {
      return this.gameLinks?.find(({ id }) => id === 'official')?.url;
    },

    gameModes() {
      return this.game?.game_modes;
    },

    gameName() {
      return this.game?.name;
    },

    playerPerspectives() {
      return this.game?.player_perspectives;
    },

    gameGenres() {
      return this.game?.genres;
    },

    // releaseDates() {
    //   const releaseDates = this.game?.release_dates?.slice();
    //
    //   const sortedActivities = releaseDates?.sort((a, b) => a.date - b.date);
    //
    //   return sortedActivities?.map(({ platform, date, id }) => {
    //     return {
    //       id,
    // TODO: use platforms from store
    //       platform: this.platformNames?.[platform]?.name,
    //       date: new Date(date * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    //     };
    //   });
    // },

    gameThemes() {
      return this.game?.themes;
    },

    gameRemakes() {
      return this.game?.remakes;
    },

    gameRemasters() {
      return this.game?.remasters;
    },

    gameBundles() {
      return this.game?.bundles;
    },

    gameEngines() {
      return this.game?.game_engines;
    },

    gameDevelopers() {
      return this.game?.involved_companies
        ?.filter(({ developer }) => developer)
        ?.map(({ company }) => company) || [];
    },

    gamePublishers() {
      return this.game?.involved_companies
        ?.filter(({ publisher }) => publisher)
        ?.map(({ company }) => company) || [];
    },

    gamePlatforms() {
      return this.game?.platforms;
    },

    hasArtworks() {
      return this.game?.artworks?.length > 0;
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

    hasWallpaper() {
      return Boolean(this.game?.steam?.background);
    },

    cachedGame() {
      return this.games?.[Number(this.gameId)] || this.game;
    },

    gameCategory() {
      return GAME_CATEGORIES?.[this.game?.category];
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

    if (!this.tags) {
      await this.$store.dispatch('LOAD_TAGS');
    }

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
      this.$store.commit('SET_SCROLLED', !visible);
    },

    async loadGame() {
      window.scrollTo(0, 0);
      this.loading = true;
      this.$bus.$emit('CLEAR_WALLPAPER');
      this.$store.commit('CLEAR_GAME');

      await this.$store.dispatch('IGDB', {
        path: 'games',
        data: `${IGDB_QUERIES.GAME} where id = ${this.gameId};`,
        mutation: 'SET_GAME',
      }).catch((e) => {});

      setPageTitle(this.game?.name);

      this.loading = false;

      this.wikipediaDescription = this.wikipediaSlug
        ? await this.$store.dispatch('LOAD_WIKIPEDIA_DESCRIPTION', this.wikipediaSlug).catch((e) => {})
        : null;

      const steamUrl = this.game?.websites?.find(({ category }) => category === STEAM_CATEGORY_ID)?.url;
      const steamGameId = steamUrl?.split('app/')[1]?.split('/')[0];

      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId).catch((e) => {});

      const gogPage = this.game?.websites?.find(({ category }) => category !== GOG_CATEGORY_ID);
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game?.name).catch((e) => {});

      const wikipediaSlug = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA)?.url?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', steamGameId).catch((e) => {});

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-page {
  background-size: contain;
  background-repeat: repeat-y;

  &.offset-background {
    background-position-y: 81vh;
  }
}

.has-artworks {
  @media(min-width: 768px) {
    margin-top: -22vh;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss">
.game-description {
  &.steam {
    // Steam overrides
  }

  img {
    max-width: 100%;
    border-radius: .25rem;
  }
}

.mw-empty-elt {
  display: none;
}

.wiki-content img {
  float: left;
  border-radius: 1rem;
  padding-right: 1rem;
  width: auto;
}

.news-ticker {
  position: absolute;
  width: 100%;
  height: 30px;
  overflow: hidden;

  ul {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;

    &[data-length="5"] {
      top: 30px;
      animation-name: news-5;
      animation-duration: 30s;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-delay: 3s;
    }

    &[data-length="4"] {
      top: 30px;
      animation-name: news-4;
      animation-duration: 24s;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-delay: 3s;
    }
    &[data-length="3"] {
      top: 30px;
      animation-name: news-3;
      animation-duration: 18s;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-delay: 3s;
    }
    &[data-length="2"] {
      top: 30px;
      animation-name: news-2;
      animation-duration: 12s;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-delay: 3s;
    }

    &:hover {
      animation-play-state: paused;
    }
  }
}

.news {
  height: 30px;
  line-height: 30px;
}

@keyframes news-5 {
    0% {top: 30px; visibility: visible;}
    5% {top: 0;}

    15% {top: 0;}
    20% {top: -30px;}

    35% {top: -30px;}
    40% {top: -60px;}

    55% {top: -60px;}
    60% {top: -90px;}

    75% {top: -90px;}
    80% {top: -120px;}

    95% {top: -120px; }
    99% {top: -150px; visibility: hidden;}
    100% {top: 30px; visibility: hidden;}
  }

  @keyframes news-4 {
    0% { top: 30px; visibility: visible; }
    5% { top: 0; }
    15% { top: 0; }
    20% { top: -30px; }
    40% { top: -30px; }
    45% { top: -60px; }
    65% { top: -60px; }
    70% { top: -90px; }
    90% { top: -90px; }
    95% { top: -120px; }
    99% { top: -120px; visibility: hidden; }
    100% { top: 30px; visibility: hidden; }
  }

  @keyframes news-3 {
    0% {top: 30px; visibility: visible;}
    5% {top: 0;}

    30% {top: 0;}
    35% {top: -30px;}

    60% {top: -30px;}
    65% {top: -60px;}

    90% {top: -60px;}
    95% {top: -90px;}

    99% {top: -90px; visibility: hidden;}
    100% {top: 30px; visibility: hidden;}
  }

  @keyframes news-2 {
    0% {top: 30px; visibility: visible;}
    5% {top: 0;}

    55% {top: 0;}
    60% {top: -30px;}

    90% {top: -30px;}
    95% {top: -60px;}

    99% {top: -60px; visibility: hidden;}
    100% {top: 30px; visibility: hidden;}
  }
</style>
