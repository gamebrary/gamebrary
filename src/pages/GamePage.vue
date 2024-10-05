<!-- TODO: steam categories, display all useful info such as (full controller support, steam cloud supported, etc...) -->
<!-- TODO: finish speedruns, get as much data as possible and render useful stuff -->
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
    :class="[{ 'text-light': darkTheme }]"
  >
    <portal to="headerActions">
      <b-dropdown
        v-if="game && user"
        v-bind="buttonProps"
      >
        <template #button-content>
          {{ gameName }}
        </template>

        <b-dropdown-item
          @click="$router.push({ name: 'game.notes', params: { id: gameId, slug: game.slug } })"
        >
          Add note
        </b-dropdown-item>
        <b-dropdown-item v-b-toggle.gameTagsSidebar>Edit tags</b-dropdown-item>
        <b-dropdown-item v-b-modal.addRemoveGameModal>Add to list</b-dropdown-item>
      </b-dropdown>
    </portal>

    <GameMediaModal />

    <div class="game-detail">
      <aside>
        <GameCover />
      </aside>

      <article>
        <div class="d-flex align-items-center">
          <h1 id="popover-target-1" :class="{ 'text-danger': isLiked, 'cursor-pointer': alternativeNames.length }">
            {{ gameName }}
          </h1>

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

          <b-badge v-if="gameCategory" variant="info" class="ml-2">
            {{ gameCategory }}
          </b-badge>
        </div>

        <div :class="['game-description pb-4', source]">
          <p v-html="description" />

          <p class="small">
            <template>
                Developed by
                <b-link
                  v-for="(developer, index) in gameDevelopers"
                  :key="index"
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
        </div>

        <div>
          <div v-if="user">
            <b-button
              v-for="({ bgColor, textColor, name }, index) in tagsApplied"
              :key="index"
              size="sm"
              variant="transparent"
              class="mr-2 mb-2"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              v-b-toggle.gameTagsSidebar
            >
              <i class="fa-solid fa-tag mr-1" />
              {{ name }}
            </b-button>

            <GameTagsSidebar />
          </div>

          <AmazonLink class="mr-3" />

          <b-button
            v-if="gogGame"
            v-b-tooltip.hover
            variant="white"
            title="Buy from GOG.com"
            target="_blank"
            :href="`https://gog.com${gogGameUrl}`"
          >
            <img
              src="/logos/data-sources/gog.svg"
              alt="gog"
              width="20"
              class="mr-1"
            />

            Buy from GOG
          </b-button>

          <div class="mt-3">
            <div v-if="gameGenres" class="float-left mr-3 mb-3">
              <h4>Genres</h4>

              <router-link
                  v-for="(genre, index) in gameGenres"
                  :to="{ name: 'search', query: { filterBy: 'genres', value: genre.id }}"
                  :key="index"
                >
                  <small>{{ genre.name }}</small>
                  <br />
                </router-link>
            </div>

            <div v-if="gameThemes" class="float-left mr-3 mb-3">
              <h4>Themes</h4>

              <router-link
                v-for="(theme, index) in gameThemes"
                :to="{ name: 'search', query: { filterBy: 'themes', value: theme.id }}"
                :key="index"
              >
                <small>{{ theme.name }}</small>
                <br />
              </router-link>
            </div>

            <div v-if="gameModes" class="float-left mr-3 mb-3">
              <h4>{{ $t('board.gameModal.gameModes') }} </h4>

              <router-link
                v-for="(gameMode, index) in gameModes"
                :key="index"
                :to="{ name: 'search', query: { filterBy: 'game_modes', value: gameMode.id }}"
              >
                <small>{{ gameMode.name }}</small>
                <br />
              </router-link>
            </div>

            <div v-if="gameEngines" class="float-left mr-3 mb-3">
              <h4>Game engines</h4>

              <span
                v-for="(gameEngine, index) in gameEngines"
                :key="index"
                >
                <small>{{ gameEngine.name }}</small>
                <br />
              </span>
            </div>

            <div v-if="playerPerspectives" class="float-left mr-3 mb-3">
              <h4>Perspective</h4>

              <router-link
                v-for="(perspective, index) in playerPerspectives"
                :key="index"
                :to="{ name: 'search', query: { filterBy: 'player_perspectives', value: perspective.id }}"
              >
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
          </div>

          <div v-if="gamePlatforms" class="d-inline-block w-100 mb-3">
            <h3>Available for</h3>

            <b-link
              v-for="(platform, index) in gamePlatforms"
              :key="index"
              size="sm"
              variant="link"
              class="mr-2 mb-2"
              :to="{ name: 'search', query: { filterBy: 'platforms', value: platform.id }}"
            >
              <small>{{ platform.name }}</small>
              <br />
            </b-link>
          </div>

          <GameProgress />

          <div v-if="gameLinks.length">
            <h3 class="my-3">External links</h3>

            <b-button
              v-for="({ url, id, svg }, index) in gameLinks"
              :href="url"
              :key="index"
              variant="white"
              class="mr-2 mb-2"
              target="_blank"
            >
              <img
                v-if="svg"
                :src="`/logos/companies/${id}.svg`"
                width="20"
                class="mr-1"
              />
              <span class="text-capitalize">{{ id }}</span>
            </b-button>
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
      </article>

      <aside>
        <GameInBoards class="d-none d-lg-inline" />
      </aside>
    </div>

    <GameInBoards class="d-lg-none" />
    <AddRemoveGame />

    <b-container>
      <!-- https://commons.wikimedia.org/wiki/Special:FilePath/TMC_Jabber_Nut_Sprite.png -->
      <!-- https://commons.wikimedia.org/wiki/Special:FilePath/Ad-tech_London_2010_(2).JPG -->
      <!-- https://commons.wikimedia.org/wiki/Special:FilePath/Ad-tech_London_2010_(2).JPG?width=200 (to get a thumbnail of 200px width) -->
      <!-- https://commons.wikimedia.org/w/thumb.php?f=Ad-tech_London_2010_(2).JPG&w=200 -->
      <!-- <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/JPG_Test.jpg" alt=""> -->
      <!-- https://en.wikipedia.org/w/api.php?action=query&titles=File:Test.jpg&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url -->

      <!-- <GameSpeedruns /> -->

      <!-- <timeline
        v-if="twitterHandle"
        :id="twitterHandle"
        sourceType="profile"
      >
        loading...
      </timeline> -->
    </b-container>

    <!-- TODO: finish this, also figure out what else we can use from steam -->
    <div class="steam-extra-info">
      <section v-if="hasRequirements">
        <h3 class="mb-2">Requirements</h3>
        <b-list-group>
          <b-list-group-item
            class="d-flex align-items-center"
            v-for="(requirement, index) in gameRequirements"
            :key="index"
          >
            <div class="d-flex flex-column">
              <p v-if="requirement.minimum.length > 100" v-html="requirement.minimum" />
              <p v-if="requirement.recommended.length > 100" v-html="requirement.recommended" />
            </div>
          </b-list-group-item>
        </b-list-group>
      </section>

      <section v-if="highlightedAchievements">
        <h3 class="mb-2">Achievements</h3>

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

            <h3>{{ achievement.name }}</h3>
          </b-list-group-item>
        </b-list-group>
      </section>

      <section v-if="latestNews">
        <h3 class="mb-2">Latest news</h3>

        <b-list-group>
          <b-list-group-item
            v-for="article in latestNews"
            :key="article.id"
            action
            button
            @click="$router.push({ name: 'game.news', params: { id: game.id } })"
          >
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1">{{ article.title }}</h4>
              <small>{{ article.date }}</small>
            </div>

              <small v-if="article.author">By {{ article.author }}</small>

              from

              <a
                v-if="article.source.url"
                :href="article.source.url"
                :title="article.source.name"
                target="blank"
                class="mb-2 ml-2"
              >
                <b-img
                  width="20"
                  :src="`/logos/news-sources/${article.source.img}`"
                />
              </a>

              <br />

              <b-badge v-for="tag in article.tags" :key="tag">{{ tag }}</b-badge>
          </b-list-group-item>
        </b-list-group>
      </section>

      <section v-if="!true">
        <GameSpeedruns />
      </section>
    </div>


    <SimilarGames class="mt-sm-5" />

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
import AmazonLink from '@/components/Game/AmazonLink';
import GameCover from '@/components/Game/GameCover';
import GameInBoards from '@/components/Game/GameInBoards';
import GameProgress from '@/components/Game/GameProgress';
import GameTagsSidebar from '@/components/Game/GameTagsSidebar';
import AddRemoveGame from '@/components/AddRemoveGame';
import SimilarGames from '@/components/Game/SimilarGames';
import GameMediaModal from '@/components/Game/GameMediaModal';
import GameSpeedruns from '@/components/Game/GameSpeedruns';
import { STEAM_CATEGORY_ID, GOG_CATEGORY_ID, TWITTER_CATEGORY_ID, IMAGE_SIZE_SCREENSHOT_HUGE, IGDB_QUERIES } from '@/constants';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameTagsSidebar,
    GameProgress,
    AmazonLink,
    GameCover,
    GameMediaModal,
    GameInBoards,
    GameSpeedruns,
    SimilarGames,
    AddRemoveGame,
  },

  data() {
    return {
      loading: false,
      wikipediaDescription: null,
    };
  },

  _computed: {
    ...mapState(['game', 'cachedGames', 'tags', 'boards', 'user', 'notes', 'twitchToken', 'games']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks', 'gameGenres', 'buttonProps']),

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
    latestNews() {
      return this.gameNews?.slice(0, 10);
    },

    macRequirements() {
      return this.game?.steam?.mac_requirements?.minimum?.length > 60
          ? this.game?.steam?.mac_requirements
          : null;
    },

    linuxRequirements() {
      return this.game?.steam?.linux_requirements?.minimum?.length > 60
          ? this.game?.steam?.linux_requirements
          : null;
    },

    pcRequirements() {
      return this.game?.steam?.pc_requirements?.minimum?.length > 60
          ? this.game?.steam?.pc_requirements
          : null;
    },

    gameRequirements() {
      return [
        this.macRequirements,
        this.linuxRequirements,
        this.pcRequirements,
      ].filter((req) => req);
    },

    hasRequirements() {
      return [
        this.macRequirements,
        this.linuxRequirements,
        this.pcRequirements,
      ].some((req) => req);
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

    releaseDates() {
      const releaseDates = this.game?.release_dates?.slice();

      const sortedActivities = releaseDates?.sort((a, b) => a.date - b.date);

      return sortedActivities?.map(({ platform, date, id }) => {
        return {
          id,
          platform: this.platformNames?.[platform]?.name,
          date: new Date(date * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' }),
        };
      });
    },

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
        };
      }) || [];
    },

    originBoardId() {
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
  get computed() {
    return this._computed;
  },
  set computed(value) {
    this._computed = value;
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

      // const wikipediaSlug = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA)?.url?.split('/wiki/')[1];

      // if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});

      // this.setWallpaper();

      this.loading = false;
    },

    setWallpaper() {
      const steamBackground = this.game?.steam?.background;
      const [{ url }] = this.artworks?.filter(({ url }) => url);

      const wallpaper = url || steamBackground;

      if (wallpaper) this.$bus.$emit('UPDATE_WALLPAPER', url);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

<style lang="scss" rel="stylesheet/scss">
.game-description {
  img {
    max-width: 100%;
    border-radius: .25rem;
  }
}

.game-detail {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 520px auto 380px;

  @media(max-width: 1440px) {
    grid-template-columns: 2fr 3fr;
  }

  @media(max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 780px) {
    display: flex;
    flex-direction: column;
  }
}

.steam-extra-info {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;

  @media(max-width: 1440px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 780px) {
    grid-template-columns: 1fr;
  }
}
</style>
