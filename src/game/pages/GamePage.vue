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
<template lang="html">
  <section>
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else-if="game">
      <game-header v-if="hasArtworks" />

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
            :variant="darkTheme ? 'secondary' : 'light'"
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
            style="z-index: 1"
            :class="['text-center', { 'has-artworks': hasArtworks }]"
          >
            <b-img
              :src="$options.getImageUrl(game)"
              :alt="game.name"
              v-b-modal.mediaModal
              rounded
              fluid
            />

            <game-in-boards class="d-none d-md-block mt-5" />

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
            <template v-if="highlightedAchievements">
              <h4 :class="['mt-5', { 'text-outlined': hasWallpaper }]">Achievements</h4>

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
              <!-- TODO: load all achievements -->
            </template>
          </b-col>

          <b-col
            cols="12"
            md="8"
            lg="5"
            xl="6"
            :class="['pt-3', darkTheme || hasWallpaper ? 'text-light' : '']"
          >
            <div class="d-flex justify-content-between" v-b-visible="visibleHandler">
              <h2 :class="{ 'mt-3': hasArtworks }">{{ game.name }}</h2>
            </div>

            <div :class="['game-description', source]">
              <b-spinner v-if="loading" class="spinner-centered" />

              <template v-else>
                <div v-html="description" />
                <!-- TODO: use logos for listing all sources -->
                <span class="text-muted mt-n3 mb-3 text-capitalize">Source: {{ source }}</span>
              </template>
            </div>

            <b-alert
              v-if="note"
              v-html="note"
              show
              class="cursor-pointer mt-3"
              variant="warning"
              @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
            />

            <game-ratings />

            <small
              v-if="legalNotice"
              class="text-muted"
              v-html="legalNotice"
            />

            <game-media />

            <!-- <game-speedruns /> -->
          </b-col>

          <b-col
            cols="12"
            md="12"
            lg="3"
            xl="3"
            :class="['pt-3', darkTheme || hasWallpaper ? 'text-light' : '']"
          >
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

            <h4 class="mt-4">External links</h4>

            <b-button
              v-for="{ url, id, icon, svg } in gameLinks"
              :href="url"
              :key="id"
              :title="$t(`board.gameModal.links.${id}`)"
              v-b-tooltip.hover
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

            <div v-if="gamePublishers.length" class="d-flex justify-content-center flex-column">
              <h4 class="mt-4">Published by:</h4>

              <div>
                <b-link
                  v-for="publisher in gamePublishers"
                  :key="publisher.id"
                  :to="{ name: 'company', params: { id: publisher.id }}"
                >
                  <!-- TODO: use publisher.logo.alpha_channel to style logo -->
                  <b-img
                    v-if="publisher.logo"
                    :src="$options.getImageUrl(publisher)"
                    :alt="publisher.name"
                    class="mr-2 mb-2"
                    width="60"
                  />

                  <span v-else>{{ publisher.name }}</span>
                </b-link>
              </div>
            </div>

            <div v-if="gameDevelopers.length">
              <h4 class="mt-4">Developed by:</h4>

              <b-link
                v-for="developer in gameDevelopers"
                :key="developer.id"
                :to="{ name: 'company', params: { id: developer.id }}"
              >
                <b-img
                  v-if="developer.logo"
                  :src="$options.getImageUrl(developer)"
                  :alt="developer.name"
                  class="mr-2 mb-2"
                  width="60"
                />

                <span v-else>{{ developer.name }}</span>
              </b-link>
            </div>

            <div v-if="alternativeNames.length">
              <h4 class="mt-4">Alternative names:</h4>

              <div
                class="mb-1"
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
              <h4 class="mt-4">Available for:</h4>

              <b-link
                v-for="platform in gamePlatforms"
                :key="platform.id"
                block
                class="pb-0 text-left"
                :to="{ name: 'search', query: { filterBy: 'platforms', value: platform.id }}"
              >
                {{ platform.name }}
              </b-link>
            </div>

            <game-in-boards class="d-md-none mt-4" />
          </b-col>
        </b-row>

        <!-- <timeline
          v-if="twitterHandle"
          :id="twitterHandle"
          sourceType="profile"
        >
          loading...
        </timeline> -->
      </b-container>

      <similar-games :has-wallpaper="hasWallpaper" />
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
// import GameDetails from '@/components/Game/GameDetails';
import GameMedia from '@/components/Game/GameMedia';
import GameInBoards from '@/components/Game/GameInBoards';
import GameProgress from '@/components/Game/GameProgress';
import GameTagsModal from '@/components/Game/GameTagsModal';
import GameHeader from '@/components/Game/GameHeader';
import GameRatings from '@/components/Game/GameRatings';
import SimilarGames from '@/components/Game/SimilarGames';
// import GameSpeedruns from '@/components/Game/GameSpeedruns';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, TWITTER_CATEGORY_ID, IMAGE_SIZE_SCREENSHOT_HUGE } from '@/constants';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameTagsModal,
    GameHeader,
    GameProgress,
    // AmazonLinks,
    // GameDetails,
    GameMedia,
    GameInBoards,
    GameRatings,
    // GameSpeedruns,
    SimilarGames,
  },

  data() {
    return {
      loading: false,
      showHeaderTitle: false,
      wikipediaDescription: null,
    };
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags', 'boards', 'user', 'notes', 'twitchToken']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks']),

    description() {
      return this.wikipediaExtract || this.steamDescription || this.igdbDescription;
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
      if (!this.tags) return [];

      return this.tags?.map((tag, index) => ({ ...tag, index }))
        .filter((tag) => tag?.games?.includes(this.game?.id));
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
    },

    async loadGame() {
      this.loading = true;
      this.$bus.$emit('CLEAR_WALLPAPER');
      this.$store.commit('CLEAR_GAME');

      await this.$store.dispatch('LOAD_GAME', this.gameId).catch(() => {});

      setPageTitle(this.game?.name);

      this.loading = false;

      this.loadArtworks();

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
      if (this.game?.steam?.background) {
        this.$bus.$emit('UPDATE_WALLPAPER', this.game?.steam?.background)
      };

      this.loading = false;
    },

    async loadArtworks() {
      await this.$store.dispatch('IGDB', {
        path: 'artworks',
        data: `fields *; where game = ${this.game.id}; limit 20;`,
        mutation: 'APPEND_GAME_ARTWORKS'
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.has-artworks {
  margin-top: -25vh;

  @media(max-width: 780px) {
    margin-top: -3rem;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss">
.game-description {
  &.steam {
    // Steam overrides
  }

  h2, h3 {
    margin: 0;
  }

  h2 {
    font-size: 14px;
    margin: 8px 0;
  }

  h3 {
    font-size: 18px;
  }

  h4, h5, h6 {
    font-size: 16px;
    font-weight: bold;
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
</style>
