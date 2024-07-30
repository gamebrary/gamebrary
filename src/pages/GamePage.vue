<!-- TODO: refresh cached game on game id change -->
<!-- TODO: fix background, add options? -->
<template lang="html">
  <div v-if="!loading && !game" class="pt-5">
    <div class="d-flex justify-content-center align-items-center">
      <h1 class="mr-3 pr-3 align-top border-right border-danger inline-block align-content-center text-danger">404</h1>
      <div class="inline-block align-middle">
        <h2 class="font-weight-normal lead text-danger">Game was not found.</h2>
      </div>
    </div>
  </div>

  <section
    v-else
    :class="[{ 'text-light': darkTheme }, 'game-page']"
  >
    <portal to="headerActions">
      <b-dropdown id="dropdown-1" text="Edit game" class="m-md-2">
        <b-dropdown-item @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
          Add note
        </b-dropdown-item>
        <b-button v-b-modal.gameTagsModal>Edit tags</b-button>
        <b-button v-b-modal.addRemoveGameModal>Add to list</b-button>
      </b-dropdown>
    </portal>

    <b-row>
      <b-col
        cols="12"
        sm="6"
        md="5"
        lg="4"
        xl="3"
      >
        <GameCover />
        <GameMedia />

        <game-page-tile
        v-if="newsHighlights"
        size="quarter"
        title="News"
      >
        <ul>
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
      </game-page-tile>
      </b-col>

      <b-col
        cols="12"
        sm="6"
        md="7"
        lg="8"
        xl="5"
      >
        <div>
          <div
            class="d-flex justify-content-between align-items-end mb-2"
            v-b-visible="(value) => titleVisible = !value"
          >
            <div :class="['d-flex align-items-center']">
              <h2 id="popover-target-1" :class="{ 'text-danger': isLiked, 'cursor-pointer': alternativeNames.length }">
                {{ gameName }}
              </h2>

              <b-popover
                v-if="alternativeNames.length"
                target="popover-target-1"
                triggers="hover"
                placement="top"
              >
                <strong class="mb-2 d-block">Alternative names:</strong>

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
              </b-popover>

              <!-- TODO: use popover to show more info (e.g. if port, show original game) -->
              <!-- TODO: if type of === expansion, then show original game in popover -->
              <b-badge v-if="gameCategory" variant="info" class="ml-2">
                {{ gameCategory }}
              </b-badge>
            </div>
          </div>

          <div v-if="user">
            <!-- <b-link v-if="!tagsApplied.length" v-b-modal.gameTagsModal>
              Add tag
            </b-link> -->

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

          <div :class="['game-description pb-4', source]">
            <b-spinner v-if="loading" class="spinner-centered" />

            <template v-else>
              <p v-html="description" />

              <p class="small">
                <template>
                    Developed by 
                    <b-link
                      v-for="developer in gameDevelopers"
                      :key="developer.id"
                      :to="{ name: 'company', params: { id: developer.id, slug: developer.slug }}"
                      class="mr-2 mb-2 align-items-center"
                    >
                      <span>{{ developer.name }}</span>
                    </b-link>
                </template>

                Published by
                <b-link
                  v-for="publisher in gamePublishers"
                  :key="publisher.id"
                  :to="{ name: 'company', params: { id: publisher.id, slug: publisher.slug }}"
                >
                  {{ publisher.name }}
                </b-link>
              </p>
              <small class="text-muted mb-3 text-capitalize">Source: {{ source }}</small>
            </template>
          </div>

          <AmazonLinks />

          <b-link
            v-if="gogGame"
            v-b-tooltip.hover
            title="Buy from GOG.com"
            target="_blank"
            class="bg-white text-dark p-2 rounded d-inline-flex flex-column small align-items-center"
            :href="`https://gog.com${gogGameUrl}`"
          >
            Available at
            <img src="/logos/data-sources/gog.svg" alt="gog" width="60">
          </b-link>

          <div class="mt-3">
            <div v-if="gameGenres" class="float-left mr-3 mb-3">
              <h4>Genres</h4>

              <router-link
                  v-for="genre in gameGenres"
                  :to="{ name: 'search', query: { filterBy: 'genres', value: genre.id }}"
                  :key="genre.id"
                >
                  <small>{{ genre.name }}</small>
                  <br />
                </router-link>
            </div>

            <div v-if="gameThemes" class="float-left mr-3 mb-3">
              <h4>Themes</h4>

              <router-link
                v-for="theme in gameThemes"
                :to="{ name: 'search', query: { filterBy: 'themes', value: theme.id }}"
                :key="theme.id"
              >
                <small>{{ theme.name }}</small>
                <br />
              </router-link>
            </div>

            <div v-if="gameModes" class="float-left mr-3 mb-3">
              <h4>{{ $t('board.gameModal.gameModes') }} </h4>

              <router-link
                v-for="gameMode in gameModes"
                :key="gameMode.id"
                :to="{ name: 'search', query: { filterBy: 'game_modes', value: gameMode.id }}"
              >
                <small>{{ gameMode.name }}</small>
                <br />
              </router-link>
            </div>

            <div v-if="gameEngines" class="float-left mr-3 mb-3">
              <h4>Game engines</h4>

              <span
                v-for="gameEngine in gameEngines"
                :key="gameEngine.id"
                >
                <!-- :to="{ name: 'search', query: { filterBy: 'game_modes', value: gameEngine.id }}" -->
                <small>{{ gameEngine.name }}</small>
                <br />
              </span>
            </div>

            <div v-if="playerPerspectives" class="float-left mr-3 mb-3">
              <h4>Perspective</h4>

              <router-link
                v-for="perspective in playerPerspectives"
                :key="perspective.id"
                :to="{ name: 'search', query: { filterBy: 'player_perspectives', value: id }}"
              >
                <!-- :to="{ name: 'search', query: { filterBy: 'game_modes', value: perspective.id }}" -->
                <small>{{ perspective.name }}</small>
                <br />
              </router-link>
            </div>

            <!-- <div>
              <h4 class="mt-3">{{ $t('board.gameModal.releaseDate') }}</h4>
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

            <!-- TODO: add game requirements -->
            <!-- <b-col cols="6" sm="4" md="3" lg="12" v-if="gameRequirements">
              <div
                v-for="(requirement, index) in gameRequirements"
                :key="index"
              >
                <pre>{{ index }}</pre>
                <p v-html="requirement.minimum" />
                <p v-html="requirement.recommended" />
              </div>
            </b-col> -->
          </div>

          <div v-if="gamePlatforms" class="d-inline-block w-100 mb-3">
            <h3>Available for</h3>

            <b-link
              v-for="platform in gamePlatforms"
              :key="platform.id"
              size="sm"
              variant="link"
              class="mr-2 mb-2"
              :to="{ name: 'search', query: { filterBy: 'platforms', value: platform.id }}"
            >
              <small>{{ platform.name }}</small>
              <br />
            </b-link>
          </div>

          <game-progress />

          <div v-if="gameLinks.length">
            <h4 class="mt-3">External links</h4>

            <b-link
              v-for="({ url, id }, index) in gameLinks"
              :href="url"
              :key="index"
              target="_blank"
              :class="['text-left p-1 mr-2', darkTheme ? 'text-success' : '']"
            >
              <span class="text-capitalize">{{ id }}</span>
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
        </div>
      </b-col>

      <b-col
        cols="12"
        xl="4"
      >
        <game-header />
        <GameInBoards class="mb-3" />
        <SimilarGames class="mt-sm-5" />

      </b-col>
    </b-row>

    <add-remove-game />

    <b-container>
      <!-- https://commons.wikimedia.org/wiki/Special:FilePath/TMC_Jabber_Nut_Sprite.png -->
      <!-- https://commons.wikimedia.org/wiki/Special:FilePath/Ad-tech_London_2010_(2).JPG -->
      <!-- https://commons.wikimedia.org/wiki/Special:FilePath/Ad-tech_London_2010_(2).JPG?width=200 (to get a thumbnail of 200px width) -->
      <!-- https://commons.wikimedia.org/w/thumb.php?f=Ad-tech_London_2010_(2).JPG&w=200 -->
      <!-- <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/JPG_Test.jpg" alt=""> -->
      <!-- https://en.wikipedia.org/w/api.php?action=query&titles=File:Test.jpg&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url -->

      <portal to="pageTitle">
        <h3
          v-show="titleVisible"
          :class="darkTheme ? 'text-light text-outlined' : ''"
        >
        <b-img
          :blank="loading"
          :src="$options.getImageUrl(cachedGame)"
          :alt="gameName"
          bordered
          class="mr-2"
          style="max-height: 40px; width: auto;"
          v-b-modal.mediaModal
        />
          {{ gameName }}
        </h3>
      </portal>

      <b-row>
        <b-col
          cols="12"
          md="4"
          xl="4"
          style="z-index: 1"
          class="text-center pt-3 pt-md-0"
        >
          <!-- <template v-if="highlightedAchievements">
            <h3 :class="['mt-5']">Achievements</h3>

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
        </b-col>
        <!-- <game-speedruns /> -->
      </b-row>

      <!-- <timeline
        v-if="twitterHandle"
        :id="twitterHandle"
        sourceType="profile"
      >
        loading...
      </timeline> -->
    </b-container>

    <p
      v-if="legalNotice"
      class="text-muted mt-2 mb-5 p-3 small"
      v-html="legalNotice"
    />
  </section>
</template>

<script>
import { setPageTitle } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import { WEBSITE_CATEGORIES, GAME_CATEGORIES, PLATFORMS, GAME_DESC_SM_CHAR_COUNT } from '@/constants';
import AmazonLinks from '@/components/Game/AmazonLinks';
import GameCover from '@/components/Game/GameCover';
import GamePageTile from '@/components/Game/GamePageTile';
import GameInBoards from '@/components/Game/GameInBoards';
import GameProgress from '@/components/Game/GameProgress';
import GameTagsModal from '@/components/Game/GameTagsModal';
import GameHeader from '@/components/Game/GameHeader';
import AddRemoveGame from '@/components/AddRemoveGame';
import SimilarGames from '@/components/Game/SimilarGames';
import GameMedia from '@/components/Game/GameMedia';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, TWITTER_CATEGORY_ID, IMAGE_SIZE_SCREENSHOT_HUGE, IGDB_QUERIES } from '@/constants';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameTagsModal,
    GameHeader,
    GameProgress,
    AmazonLinks,
    GameCover,
    GameMedia,
    GamePageTile,
    GameInBoards,
    // GameSpeedruns,
    SimilarGames,
    AddRemoveGame,
  },

  data() {
    return {
      loading: false,
      titleVisible: false,
      wikipediaDescription: null,
    };
  },

  computed: {
    ...mapState(['game', 'cachedGames', 'tags', 'boards', 'user', 'notes', 'twitchToken', 'games']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks', 'gameGenres']),

    gameCollection() {
      return this.game?.collection;
    },

    description() {
      return this.igdbDescription || this.steamDescription || this.wikipediaExtract;
    },

    hasShortDescription() {
      return this.description?.length < GAME_DESC_SM_CHAR_COUNT;
    },

    // background() {
    //   return this.game?.steam?.background;
    // },

    // gameRequirements() {
    //   const steamGame = this.game?.steam;
    //
    //   if (!steamGame) return null;
    //
    //   return {
    //     mac: steamGame?.mac_requirements || null,
    //     linux: steamGame?.linux_requirements || null,
    //     pc: steamGame?.pc_requirements || null,
    //   };
    // },

    newsHighlights() {
      return this.gameNews?.slice(0, 5)?.map(({ title }) => title?.slice(0, 50));
    },

    source() {
      if (this.igdbDescription) return 'IGDB';
      if (this.steamDescription) return 'steam';
      if (this.wikipediaExtract) return 'wikipedia';

      return 'N/A';
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

    // gameHeaderImage() {
    //   return this.game?.steam?.header_image;
    // },

    officialWebsiteUrl() {
      return this.gameLinks?.find(({ id }) => id === 'official')?.url;
    },

    fandomUrl() {
      // https://nintendo.fandom.com/api.php?action=parse&prop=sections&page=Super_Mario_Bros.&format=json
      // https://megaman.fandom.com/wiki/Special:Redirect/file/RockManWorld2.png
      return this.gameLinks?.find(({ id }) => id === 'fandom')?.url;
    },

    gameModes() {
      return this.game?.game_modes;
    },

    gameName() {
      return this.cachedGame?.name;
    },

    playerPerspectives() {
      return this.game?.player_perspectives;
    },

    // releaseDates() {
    //   const releaseDates = this.game?.release_dates?.slice();
    //
    //   const sortedActivities = releaseDates?.sort((a, b) => a.date - b.date);
    //
    //   return sortedActivities?.map(({ platform, date, id }) => {
    //     return {
    //       id,
    //       platform: this.platformNames?.[platform]?.name,
    //       date: new Date(date * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    //     };
    //   });
    // },

    gameThemes() {
      return this.game?.themes;
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
      return this.game?.platforms.map(({ id }) => {
        return {
          id,
          name: PLATFORMS?.[id]?.name,
        };
      });
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

    gogGame() {
      return this.game?.gog;
    },

    gogGameUrl() {
      return this.gogGame?.url;
    },

    gogGamePrice() {
      return `${this.gogGame.price.symbol}${this.gogGame.price.finalAmount}`;
    },

    note() {
      return this.notes[this.game?.id] || null;
    },

    legalNotice() {
      return this.game?.steam?.legal_notice;
    },

    cachedGame() {
      return this.cachedGames?.[Number(this.gameId)] || this.game;
    },

    isLiked() {
      return this.games?.[this.gameId];
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
      return this.$route.params?.id;
    },

    artworks() {
      return this.game?.artworks?.map((artwork) => ({
        url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
      }));
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

  destroyed() {
    this.$bus.$emit('CLEAR_WALLPAPER');
  },

  methods: {
    // loadFandomData() {
    //   const subdomain = this.fandomUrl?.split('://')?.[1]?.split('.')?.[0];
    //   const pageName = this.fandomUrl?.split('wiki/')?.[1];
    //
    //   if (subdomain && pageName) this.$store.dispatch('LOAD_FANDOM_DATA', { subdomain, pageName });
    // },

    // async loadSpeedruns() {
    //   const speedRunGame = await this.$store.dispatch('GET_SPEEDRUN_GAME_ID', this.game.name);
    //
    //   console.log('speedRunGame', speedRunGame);
    //
    //   const game = speedRunGame?.data?.[0];
    //   const runsLink = game?.links?.find(({ rel }) => rel === 'runs')?.uri;
    //
    //   console.log('runsLink', runsLink);
    //
    //   await this.$store.dispatch('LOAD_GAME_SPEEDRUN_RUNS', runsLink)
    //
    //   this.loaded = true;
    // },

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

    async loadGame() {
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

      // TODO: load all the stuff asyncronously

      this.wikipediaDescription = this.wikipediaSlug
        ? await this.$store.dispatch('LOAD_WIKIPEDIA_DESCRIPTION', this.wikipediaSlug).catch((e) => {})
        : null;

      // if (this.fandomUrl) this.loadFandomData();

      const steamUrl = this.game?.websites?.find(({ category }) => category === STEAM_CATEGORY_ID)?.url;
      const steamGameId = steamUrl?.split('app/')?.[1]?.split('/')?.[0];

      if (steamGameId) {
        await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId).catch((e) => {});
        await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', steamGameId).catch((e) => {});
      }

      // this.loadSpeedruns();

      const gogPage = this.game?.websites?.find(({ category }) => category !== GOG_CATEGORY_ID);
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game?.name).catch((e) => {});

      const wikipediaSlug = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA)?.url?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});

      // this.setWallpaper();

      this.loading = false;
    },

    setWallpaper() {
      console.log(this.artworks);
      const steamBackground = this.game?.steam?.background;
      const [{ url }] = this.artworks?.filter(({ url }) => url);

      const wallpaper = url || steamBackground;

      if (wallpaper) this.$bus.$emit('UPDATE_WALLPAPER', url);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-page {
  // background-size: contain;
  // background-repeat: repeat-y;

  // &.offset-background {
  //   background-position-y: 50vh;
  // }
}

// .has-artworks {
//   margin-top: -22vh;

//   @media(max-width: 1024px) {
//     margin-top: -10vh;
//     grid-template-columns: repeat(5, 1fr);
//   }

//   @media(max-width: 767px) {
//     margin-top: 1rem;
//   }
// }
</style>

<style lang="scss" rel="stylesheet/scss">
.game-description {
  img {
    max-width: 100%;
    border-radius: .25rem;
  }
}
</style>
