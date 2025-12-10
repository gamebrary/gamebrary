<!-- TODO: Improve style of section headings -->
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

  <section v-else :class="[{ 'text-light': darkTheme }]" class="px-3">
    <portal to="headerActions">
      <div v-if="game && user" class="dropdown">
        <button class="btn dropdown-toggle" :class="buttonProps?.variant ? `btn-${buttonProps.variant}` : 'btn-primary'"
          type="button" id="gameActionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <span :title="gameName" class="d-sm-none">{{ shortTruncatedGameName }}</span>
          <span :title="gameName" class="d-none d-sm-inline d-md-none">{{ truncatedGameName }}</span>
          <span class="d-none d-md-inline">{{ gameName }}</span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="gameActionsDropdown">
          <li>
            <button type="button" class="dropdown-item"
              @click="$router.push({ name: 'game.notes', params: { id: gameId, slug: game.slug } })">
              Add note
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item" data-bs-toggle="offcanvas" data-bs-target="#gameTagsSidebar">
              Edit tags
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item" data-bs-toggle="offcanvas"
              data-bs-target="#addRemoveGameSidebar">
              Add to list
            </button>
          </li>
        </ul>
      </div>
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

          <span v-if="alternativeNames.length" class="d-inline-block" data-bs-toggle="popover" data-bs-trigger="hover"
            data-bs-placement="top" :data-bs-content="getAlternativeNamesContent()">
          </span>

          <span v-if="gameCategory" class="badge bg-info ms-2">
            {{ gameCategory }}
          </span>
        </div>

        <div :class="['game-description pb-4', source]">
          <p v-html="description" />

          <p>
            <router-link v-for="(developer, index) in gameDevelopers" :key="index"
              :to="{ name: 'company', params: { id: developer.id, slug: developer.slug } }" class="link-primary me-2"
              data-bs-toggle="tooltip" :title="`Developed by ${developer.name}`">
              <img v-if="developer.logo" :src="getImageUrl(developer)" width="100" class="mr-3 mb-3"
                :alt="developer.name">

              <p v-else>
                {{ developer.name }}
              </p>
            </router-link>

            <router-link v-for="publisher in gamePublishers" :key="publisher.id"
              :to="{ name: 'company', params: { id: publisher.id, slug: publisher.slug } }" class="link-primary me-2"
              data-bs-toggle="tooltip" :title="`Published by ${publisher.name}`">
              <img v-if="publisher.logo" :src="getImageUrl(publisher)" :alt="`Published by ${publisher.name}`"
                class="me-3 mb-3" width="100">

              <p v-else>
                {{ publisher.name }}
              </p>
            </router-link>
          </p>

          <span class="text-muted mb-3 text-capitalize">Source: {{ source }}</span>
        </div>

        <div>
          <div v-if="user">
            <button v-for="({ bgColor, textColor, name }, index) in tagsApplied" :key="index" type="button"
              class="btn btn-sm me-2 mb-2" :style="`background-color: ${bgColor}; color: ${textColor}; border: none;`"
              data-bs-toggle="offcanvas" data-bs-target="#gameTagsSidebar">
              <i class="fa-solid fa-tag me-1" />
              {{ name }}
            </button>

            <GameTagsSidebar />
          </div>

          <AmazonLink class="mr-3" />

          <a v-if="gogGame" class="btn btn-light" data-bs-toggle="tooltip" title="Buy from GOG.com" target="_blank"
            :href="`https://gog.com${gogGameUrl}`">
            <img src="/logos/data-sources/gog.svg" alt="gog" width="20" class="me-1" />

            Buy from GOG
          </a>

          <GameProgress class="mt-4" />

          <div class="card my-4" :class="darkTheme ? 'bg-dark text-light' : 'bg-white text-dark'">
            <div class="card-body game-details">
              <section v-if="gamePlatforms">
                <h3 class="mb-2">Platforms</h3>

                <router-link v-for="(platform, index) in gamePlatforms" :key="index" class="btn d-block mb-3"
                  :class="darkTheme ? 'btn-dark' : 'btn-light'"
                  :to="{ name: 'search', query: { filterBy: 'platforms', value: platform.id } }">
                  {{ platform.name }}
                  <br />
                </router-link>
              </section>

              <section v-if="gameGenres">
                <h3 class="mb-2">Genres</h3>

                <router-link v-for="(genre, index) in gameGenres"
                  :to="{ name: 'search', query: { filterBy: 'genres', value: genre.id } }" :key="index"
                  class="btn d-block mb-3" :class="darkTheme ? 'btn-dark' : 'btn-light'">
                  {{ genre.name }}
                </router-link>
              </section>

              <section v-if="gameThemes">
                <h3 class="mb-2">Themes</h3>

                <router-link v-for="(theme, index) in gameThemes"
                  :to="{ name: 'search', query: { filterBy: 'themes', value: theme.id } }" :key="index"
                  class="btn d-block mb-3" :class="darkTheme ? 'btn-dark' : 'btn-light'">
                  {{ theme.name }}
                </router-link>
              </section>

              <section v-if="gameModes">
                <h3 class="mb-2">{{ $t('board.gameModal.gameModes') }} </h3>

                <router-link v-for="(gameMode, index) in gameModes" :key="index"
                  :to="{ name: 'search', query: { filterBy: 'game_modes', value: gameMode.id } }"
                  class="btn d-block mb-3" :class="darkTheme ? 'btn-dark' : 'btn-light'">
                  {{ gameMode.name }}
                </router-link>
              </section>

              <section v-if="gameEngines">
                <h3 class="mb-2">Game engines</h3>

                <div v-for="(gameEngine, index) in gameEngines" :key="index" class="btn d-block mb-3"
                  :class="darkTheme ? 'btn-dark' : 'btn-light'">
                  {{ gameEngine.name }}
                </div>
              </section>

              <section v-if="playerPerspectives">
                <h3 class="mb-2">Perspective</h3>

                <router-link v-for="(perspective, index) in playerPerspectives" :key="index"
                  :to="{ name: 'search', query: { filterBy: 'player_perspectives', value: perspective.id } }"
                  class="btn d-block mb-3" :class="darkTheme ? 'btn-dark' : 'btn-light'">
                  {{ perspective.name }}
                </router-link>
              </section>

              <!-- <div>
              <h3 class="mt-3">{{ $t('board.gameModal.releaseDate') }}</h3>
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
          </div>

          <div v-if="gameLinks.length">
            <h3 class="my-3">External links</h3>

            <a v-for="({ url, id, svg, title }, index) in gameLinks" :href="url" :key="index"
              class="btn btn-light me-2 mb-2" target="_blank">
              <img v-if="svg" :src="`/logos/companies/${id}.svg`" width="20" class="me-1" />
              <span class="text-capitalize">{{ title || id }}</span>
            </a>
          </div>

          <div v-if="note" v-html="note" class="alert alert-warning cursor-pointer mt-3" role="alert"
            @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })" />
        </div>
      </article>

      <aside>
        <GameInBoards class="d-none d-lg-inline" />
      </aside>
    </div>

    <GameInBoards class="d-lg-none" />
    <AddRemoveGame />

    <div class="container">
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
    </div>

    <!-- TODO: finish this, also figure out what else we can use from steam -->
    <div class="steam-extra-info">
      <section v-if="hasRequirements">
        <h2 class="mb-2">Requirements</h2>

        <ul class="list-group">
          <li class="list-group-item" :class="darkTheme ? 'bg-dark text-light' : 'bg-white'">
            <ul class="nav nav-tabs mt-3" role="tablist">
              <li v-for="(requirement, index) in gameRequirements" :key="index" class="nav-item" role="presentation">
                <button class="nav-link" :class="{ 'active': index === 0 }" :id="`tab-${index}`" data-bs-toggle="tab"
                  :data-bs-target="`#tab-pane-${index}`" type="button" role="tab">
                  {{ getTabTitle(requirement.platform) }}
                </button>
              </li>
            </ul>
            <div class="tab-content mt-3">
              <div v-for="(requirement, index) in gameRequirements" :key="index" class="tab-pane fade"
                :class="{ 'show active': index === 0 }" :id="`tab-pane-${index}`" role="tabpanel">
                <div class="d-flex flex-column">
                  <p v-if="requirement.minimum.length > 100" v-html="requirement.minimum" />
                  <p v-if="requirement.recommended.length > 100" v-html="requirement.recommended" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <section v-if="highlightedAchievements">
        <h3 class="mb-2">Achievements</h3>

        <ul class="list-group">
          <li class="list-group-item d-flex align-items-center" :class="darkTheme ? 'bg-dark text-light' : 'bg-white'"
            v-for="achievement in highlightedAchievements" :key="achievement.name">
            <img :src="achievement.path" alt="" class="me-2" style="width: 40px; height: 40px; object-fit: cover;" />

            <h3>{{ achievement.name }}</h3>
          </li>
        </ul>
      </section>

      <section v-if="latestNews">
        <h3 class="mb-2">Latest news</h3>

        <ul class="list-group">
          <li v-for="article in latestNews" :key="article.id" class="list-group-item list-group-item-action"
            :class="darkTheme ? 'bg-dark text-light' : 'bg-white'"
            @click="$router.push({ name: 'game.news', params: { id: game.id } })" style="cursor: pointer;">
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1">{{ article.title }}</h4>
              {{ article.date }}
            </div>

            <small v-if="article.author">By {{ article.author }}</small>

            from

            <a v-if="article.source.url" :href="article.source.url" :title="article.source.name" target="blank"
              class="mb-2 ml-2">
              <img width="20" :src="`/logos/news-sources/${article.source.img}`" alt="" />
            </a>

            <br />

            <span v-for="tag in article.tags" :key="tag" class="badge bg-secondary me-1">{{ tag }}</span>
          </li>
        </ul>
      </section>

      <section v-if="!true">
        <GameSpeedruns />
      </section>
    </div>


    <SimilarGames class="mt-sm-5" />

    <p v-if="legalNotice" class="text-muted mt-2 mb-5 p-3 small" v-html="legalNotice" />
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';
import { setPageTitle, getImageUrl } from '@/utils';
import { useGamesStore } from '@/stores/games';
import { useTagsStore } from '@/stores/tags';
import { useBoardsStore } from '@/stores/boards';
import { useUserStore } from '@/stores/user';
import { useNotesStore } from '@/stores/notes';
import { useTwitchStore } from '@/stores/twitch';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useAppGetters, useGameGetters } from '@/stores/getters';
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

const route = useRoute();
const gamesStore = useGamesStore();
const tagsStore = useTagsStore();
const boardsStore = useBoardsStore();
const userStore = useUserStore();
const notesStore = useNotesStore();
const twitchStore = useTwitchStore();
const wallpapersStore = useWallpapersStore();
const { darkTheme, buttonProps } = useAppGetters();
const $bus = inject('$bus');

const loading = ref(false);
const wikipediaDescription = ref(null);

// Store state
const game = computed(() => gamesStore.game);
const cachedGames = computed(() => gamesStore.cachedGames);
const tags = computed(() => tagsStore.tags);
const boards = computed(() => boardsStore.boards);
const user = computed(() => userStore.user);
const notes = computed(() => notesStore.notes);
const twitchToken = computed(() => twitchStore.twitchToken);
const games = computed(() => gamesStore.games);
const wallpapers = computed(() => wallpapersStore.wallpapers);

// Game getters
const gameGetters = computed(() => useGameGetters(game.value));
const gameNews = computed(() => gameGetters.value.gameNews);
const gameLinks = computed(() => gameGetters.value.gameLinks);
const gameGenres = computed(() => gameGetters.value.gameGenres);

// Computed properties
const gameCollection = computed(() => game.value?.collection);

const igdbDescription = computed(() => game.value?.summary);
const steamDescription = computed(() => game.value?.steam?.about_the_game || game.value?.steam?.short_description);
const wikipediaExtract = computed(() => {
  const pages = wikipediaDescription.value?.query?.pages;
  if (!pages) return null;
  const [key] = Object.keys(pages);
  const { extract } = pages[key];
  return extract || null;
});

const description = computed(() => igdbDescription.value || steamDescription.value || wikipediaExtract.value);
const hasShortDescription = computed(() => description.value?.length < GAME_DESC_SM_CHAR_COUNT);
const latestNews = computed(() => gameNews.value?.slice(0, 10));

const macRequirements = computed(() => {
  return game.value?.steam?.mac_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.mac_requirements, platform: 'mac' }
    : null;
});

const linuxRequirements = computed(() => {
  return game.value?.steam?.linux_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.linux_requirements, platform: 'linux' }
    : null;
});

const pcRequirements = computed(() => {
  return game.value?.steam?.pc_requirements?.minimum?.length > 60
    ? { ...game.value?.steam?.pc_requirements, platform: 'windows' }
    : null;
});

const gameRequirements = computed(() => {
  return [
    macRequirements.value,
    linuxRequirements.value,
    pcRequirements.value,
  ].filter((req) => req);
});

const hasRequirements = computed(() => {
  return [
    macRequirements.value,
    linuxRequirements.value,
    pcRequirements.value,
  ].some((req) => req);
});

const source = computed(() => {
  if (igdbDescription.value) return 'IGDB';
  if (steamDescription.value) return 'steam';
  if (wikipediaExtract.value) return 'wikipedia';
  return 'N/A';
});

const wikipediaSlug = computed(() => {
  const wikipediaData = game.value?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);
  return wikipediaData?.url?.split('/wiki/')?.[1];
});

const tagsApplied = computed(() => {
  const tagsList = tags.value?.tags || tags.value;
  if (!tagsList) return [];
  return tagsList.map((tag, index) => ({ ...tag, index }))
    .filter((tag) => tag?.games?.includes(game.value?.id));
});

const boardsWithGame = computed(() => {
  return boards.value?.filter(({ lists }) => lists?.some(({ games: listGames }) => listGames?.includes(game.value?.id))) || [];
});

const fandomUrl = computed(() => {
  return gameLinks.value?.find(({ id }) => id === 'fandom')?.url;
});

const gameModes = computed(() => game.value?.game_modes);
const cachedGame = computed(() => cachedGames.value?.[Number(gameId.value)] || game.value);
const gameName = computed(() => cachedGame.value?.name);
const truncatedGameName = computed(() => gameName.value?.length > 30 ? `${gameName.value.substring(0, 30)}...` : gameName.value);
const shortTruncatedGameName = computed(() => gameName.value?.length > 16 ? `${gameName.value.substring(0, 16)}...` : gameName.value);
const playerPerspectives = computed(() => game.value?.player_perspectives);

const platformNames = computed(() => {
  const platforms = gamesStore.platforms;
  const platformMap = {};
  platforms.forEach(platform => {
    platformMap[platform.id] = platform;
  });
  return platformMap;
});

const releaseDates = computed(() => {
  const releaseDatesList = game.value?.release_dates?.slice();
  if (!releaseDatesList) return [];
  const sortedActivities = releaseDatesList.sort((a, b) => a.date - b.date);
  return sortedActivities.map(({ platform, date, id }) => {
    return {
      id,
      platform: platformNames.value?.[platform]?.name,
      date: new Date(date * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    };
  });
});

const gameThemes = computed(() => game.value?.themes);
const gameEngines = computed(() => game.value?.game_engines);

const gameDevelopers = computed(() => {
  return game.value?.involved_companies
    ?.filter(({ developer }) => developer)
    ?.map(({ company }) => company) || [];
});

const gamePublishers = computed(() => {
  return game.value?.involved_companies
    ?.filter(({ publisher }) => publisher)
    ?.map(({ company }) => company) || [];
});

const gamePlatforms = computed(() => {
  return game.value?.platforms?.map(({ id }) => {
    return {
      id,
      name: PLATFORMS?.[id]?.name,
    };
  }) || [];
});

const metacriticScore = computed(() => game.value?.steam?.metacritic);

const getCountryCode = (alternateTitleDescription) => {
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
};

const alternativeNames = computed(() => {
  return game.value?.alternative_names?.map(({ comment, name, id }) => {
    return {
      comment,
      imgUrl: `/img/country-flags/${getCountryCode(comment)}.svg`,
      name,
      id,
    };
  }) || [];
});

const originBoardId = computed(() => route.params?.boardId);
const highlightedAchievements = computed(() => game.value?.steam?.achievements?.highlighted);
const gogGame = computed(() => game.value?.gog);
const gogGameUrl = computed(() => gogGame.value?.url);
const gogGamePrice = computed(() => {
  if (!gogGame.value?.price) return null;
  return `${gogGame.value.price.symbol}${gogGame.value.price.finalAmount}`;
});
const note = computed(() => notes.value[game.value?.id] || null);
const legalNotice = computed(() => game.value?.steam?.legal_notice);
const isLiked = computed(() => games.value?.[gameId.value]);
const gameCategory = computed(() => GAME_CATEGORIES?.[game.value?.category]);
const artworks = computed(() => {
  return game.value?.artworks?.map((artwork) => ({
    url: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE),
  })) || [];
});

// Methods
const getTabTitle = (title) => {
  if (title === 'windows') return 'PC/Windows';
  if (title === 'mac') return 'MacOS';
  if (title === 'linux') return 'Linux';
  return title;
};

const getAlternativeNamesContent = () => {
  if (!alternativeNames.value || !alternativeNames.value.length) return '';
  let content = '<strong class="mb-2 d-block">Alternative names:</strong>';
  alternativeNames.value.forEach(({ comment, id, name, imgUrl }) => {
    content += `<div class="mb-1">`;
    if (imgUrl) {
      content += `<img src="${imgUrl}" alt="" class="me-1 rounded" style="width: 24px; height: 24px; object-fit: cover;" ${comment ? `title="${comment}"` : ''} />`;
    }
    content += `${name}</div>`;
  });
  return content;
};

const waitAndLoadGame = () => {
  loading.value = true;
  setTimeout(() => {
    if (!twitchToken.value) {
      waitAndLoadGame();
    } else {
      loadGame();
    }
  }, 500);
};

const getWallpaperUrl = (url) => {
  if (!url) return '';
  if (url?.includes('igdb.com')) return url;
  const wallpaper = wallpapers.value?.find(({ fullPath }) => fullPath === url);
  return wallpaper?.url ? decodeURI(wallpaper.url) : '';
};

const loadGame = async () => {
  try {
    loading.value = true;
    if ($bus) $bus.$emit('CLEAR_WALLPAPER');
    gamesStore.clearGame();

    try {
      if (!twitchToken.value) {
        await twitchStore.getTwitchToken();
      }
      const results = await gamesStore.queryIGDB({
        path: 'games',
        data: `${IGDB_QUERIES.GAME} where id = ${gameId.value};`,
      });
      if (results && results.length > 0) {
        gamesStore.setGame(results[0]);
      }
    } catch (e) {
      console.error('Error loading game from IGDB:', e);
    }

    setPageTitle(game.value?.name);

    try {
      wikipediaDescription.value = wikipediaSlug.value
        ? await gamesStore.loadWikipediaDescription(wikipediaSlug.value)
        : null;
    } catch (e) {
      console.error('Error loading Wikipedia description:', e);
      wikipediaDescription.value = null;
    }

    const steamUrl = game.value?.websites?.find(({ category }) => category === STEAM_CATEGORY_ID)?.url;
    const steamGameId = steamUrl?.split('app/')?.[1]?.split('/')?.[0];

    if (steamGameId) {
      try {
        await gamesStore.loadSteamGame(steamGameId);
      } catch (e) {
        console.error('Error loading Steam game:', e);
      }

      try {
        await gamesStore.loadSteamGameNews(steamGameId);
      } catch (e) {
        console.error('Error loading Steam game news:', e);
      }
    }

    const gogPage = game.value?.websites?.find(({ category }) => category === GOG_CATEGORY_ID);
    if (gogPage) {
      try {
        await gamesStore.loadGogGame(game.value?.name);
      } catch (e) {
        console.error('Error loading GOG game:', e);
      }
    }
  } catch (e) {
    console.error('Error in loadGame:', e);
  } finally {
    loading.value = false;
  }
};

const setWallpaper = () => {
  const steamBackground = game.value?.steam?.background;
  const [{ url }] = artworks.value?.filter(({ url }) => url) || [];
  const wallpaper = url || steamBackground;
  if (wallpaper && $bus) $bus.$emit('UPDATE_WALLPAPER', url);
};

// Watchers
watch(gameId, (newGameId) => {
  if (newGameId) loadGame();
});

// Lifecycle hooks
onMounted(async () => {
  nextTick(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));
  });

  if (!twitchToken.value) {
    waitAndLoadGame();
    return;
  }

  if (!tags.value || tags.value.length === 0) {
    await tagsStore.loadTags(userStore.user.uid);
  }

  loadGame();
});

onBeforeUnmount(() => {
  if ($bus) $bus.$emit('CLEAR_WALLPAPER');
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>

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

  @media(max-width: 768px) {
    grid-gap: 0;
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

.game-details {
  display: grid;
  padding: 1rem;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;

  @media(max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
