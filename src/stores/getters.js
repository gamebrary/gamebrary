import { computed } from 'vue';
import { useSettingsStore } from './settings';
import { useBoardsStore } from './boards';
import { useUserStore } from './user';
import { useUIStore } from './ui';
import { useReleasesStore } from './releases';
import {
  LINKS_CATEGORIES,
  IMAGE_SIZE_720P,
  IMAGE_SIZE_THUMB,
  IMAGE_SIZE_COVER_BIG,
  GAME_GENRES,
  NEWS_SOURCES,
} from '@/constants';
import { getImageUrl } from '@/utils';
import slugify from 'slugify';
import bbobHTML from '@bbob/html';
import presetHTML5 from '@bbob/preset-html5';
import linkifyHtml from 'linkify-html';
import orderby from 'lodash.orderby';

export function useAppGetters() {
  const settingsStore = useSettingsStore();
  const boardsStore = useBoardsStore();
  const userStore = useUserStore();
  const uiStore = useUIStore();
  const releasesStore = useReleasesStore();

  const darkTheme = computed(() => {
    const boardOverride = uiStore.routeName === 'board' && boardsStore.board?.darkTheme;
    return settingsStore.darkTheme || boardOverride || false;
  });

  const transparencyEnabled = computed(() => {
    const boardOverride = uiStore.routeName === 'board' && boardsStore.board?.transparencyEnabled !== undefined;
    return boardOverride ? boardsStore.board.transparencyEnabled : (settingsStore.transparencyEnabled || false);
  });
  const showGameThumbnails = computed(() => settingsStore.showGameThumbnails || false);
  const navPosition = computed(() => settingsStore.navPosition || 'top');
  const ageRating = computed(() => settingsStore.ageRating || 'all');
  const isRTL = computed(() => settingsStore.language !== 'ar');
  const latestRelease = computed(() => releasesStore.releases?.[0]?.tag_name || 'v1');

  const sortedBoards = computed(() => orderby(boardsStore.boards, 'lastUpdated', 'desc'));
  const sortedPublicBoards = computed(() => orderby(boardsStore.publicBoards, 'lastUpdated', 'desc'));

  const isBoardOwner = computed(() => {
    return boardsStore.board?.owner === userStore.user?.uid;
  });

  const buttonProps = computed(() => ({
    variant: darkTheme.value ? 'success' : 'black',
  }));

  const sidebarRightProps = computed(() => ({
    scrollable: true,
    shadow: true,
    backdrop: true,
    right: true,
    noHeader: true,
    bgVariant: darkTheme.value ? 'dark' : 'light',
    textVariant: darkTheme.value ? 'light' : 'dark',
    sidebarClass: ['rounded-left border border-right-0', darkTheme.value ? 'border-black' : 'border-white'],
    bodyClass: 'rounded-left',
  }));

  const sidebarLeftProps = computed(() => ({
    scrollable: true,
    shadow: true,
    backdrop: true,
    noHeader: true,
    bgVariant: darkTheme.value ? 'dark' : 'light',
    textVariant: darkTheme.value ? 'light' : 'dark',
  }));

  const swatchesProps = computed(() => ({
    fallbackInputClass: 'color-input float-left',
    fallbackInputType: 'color',
    fallbackOkClass: [
      darkTheme.value ? 'bg-secondary text-light' : 'bg-light text-dark',
      'p-2 float-right',
    ],
    fallbackOkText: 'Select',
    popoverX: 'left',
    triggerStyle: {
      height: '40px',
      width: '40px',
      border: '1px solid #ced4da',
    },
    showFallback: true,
    showCheckbox: true,
  }));

  const draggableProps = computed(() => ({
    handle: '.game-card',
    ghostClass: 'ghost',
    dragClass: 'dragging',
    chosenClass: 'border-transparent',
    filter: '.drag-filter',
    delay: '50',
    animation: '500',
    group: { name: 'games' },
  }));

  return {
    darkTheme,
    transparencyEnabled,
    showGameThumbnails,
    navPosition,
    ageRating,
    isRTL,
    latestRelease,
    sortedBoards,
    sortedPublicBoards,
    isBoardOwner,
    buttonProps,
    sidebarRightProps,
    sidebarLeftProps,
    swatchesProps,
    draggableProps,
  };
}

export function useGameGetters(game) {
  const gameLinks = computed(() => {
    return game?.websites?.map(({ url, category }) => ({ url, ...LINKS_CATEGORIES[category] })) || [];
  });

  const gameGenres = computed(() => {
    return game?.genres?.map((genre) => ({
      ...genre,
      ...GAME_GENRES.find(({ id }) => id === genre.id),
    }));
  });

  const gameNews = computed(() => {
    const gameNews = game?.news?.map((article) => {
      const feedSlug = slugify(article?.feedname, {
        replacement: '',
        lower: true,
        strict: true,
      });

      const sanitizedContents = article?.contents?.replaceAll('{STEAM_CLAN_IMAGE}', 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/clans/');
      const html = bbobHTML(sanitizedContents, presetHTML5());
      const contents = linkifyHtml(html, { defaultProtocol: 'https', target: '_blank' });

      return {
        title: article.title,
        id: article.gid,
        url: article.url,
        author: article?.author || null,
        date: new Date(article.date * 1000).toLocaleDateString('en-US', { dateStyle: 'short' }),
        contents,
        source: NEWS_SOURCES?.[feedSlug] || `MISING: ${article?.feedname} | ${feedSlug}`,
        tags: article.tags,
      };
    });

    return gameNews;
  });

  const gameMedia = (thumb = false) => {
    const steamVideos = game?.steam?.movies?.map((video) => {
      const hiQuality = video?.mp4?.max;
      const lowQuality = video?.mp4?.[480];

      return {
        imageUrl: video.thumbnail,
        videoUrl: hiQuality || lowQuality,
        isVideo: true,
        source: 'Steam',
      };
    }) || [];

    const speedRunVideos = game?.speedruns
      ?.map((speedrun) => speedrun?.videos?.links?.[0]?.uri)
      ?.filter((url) => url?.includes('youtube'))
      ?.map((youtubeUrl) => {
        const youtubeId = youtubeUrl?.split('v=')?.[1];

        return {
          imageUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`,
          isVideo: true,
          source: 'YouTube',
        };
      }) || [];

    const igdbVideos = game?.videos?.map((video) => {
      return {
        imageUrl: `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/embed/${video.video_id}?rel=0&autoplay=1`,
        isVideo: true,
        source: 'YouTube',
      };
    }) || [];

    const igdbScreenshots = game?.screenshots?.map((screenshot) => ({
      imageUrl: getImageUrl(screenshot, thumb ? IMAGE_SIZE_THUMB : IMAGE_SIZE_720P),
      source: 'IGDB',
    })) || [];

    const steamScreenshots = game?.steam?.screenshots.map(({ path_full }) => ({ imageUrl: path_full, source: 'Steam' })) || [];

    const gameCover = {
      imageUrl: getImageUrl(game, thumb ? IMAGE_SIZE_THUMB : IMAGE_SIZE_COVER_BIG),
      source: 'IGDB',
      isCover: true,
    };

    const wikipediaImages = game?.wikipedia?.lead?.image?.urls
      ? [{ imageUrl: Object.values(game?.wikipedia?.lead?.image?.urls)?.[0], source: 'Wikipedia' }]
      : [];

    const gogImages = game?.gog?.gallery.map((image) => {
      const imageId = image?.split('.com/')?.[1];

      return {
        imageUrl: imageId ? `https://images.gog-statics.com/${imageId}.jpg` : null,
        source: 'GoG',
      };
    }) || [];

    const igdbArtworks = game?.artworks?.map((artwork) => ({ imageUrl: getImageUrl(artwork, IMAGE_SIZE_720P), source: 'IGDB' })) || [];

    return [
      gameCover,
      ...igdbArtworks,
      ...igdbScreenshots,
      ...gogImages,
      ...steamScreenshots,
      ...wikipediaImages,
      ...speedRunVideos,
      ...igdbVideos,
      ...steamVideos,
    ];
  };

  return {
    gameLinks,
    gameGenres,
    gameNews,
    gameMedia,
  };
}

