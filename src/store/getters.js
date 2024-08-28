import {
  NEWS_SOURCES,
  LINKS_CATEGORIES,
  IMAGE_SIZE_720P,
  IMAGE_SIZE_THUMB,
  IMAGE_SIZE_COVER_BIG,
  GAME_GENRES,
} from '@/constants';
import { getImageUrl } from '@/utils';
import slugify from 'slugify'
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
import orderby from 'lodash.orderby';
import linkifyHtml from 'linkify-html';

export default {
  latestRelease: ({ releases }) => releases?.[0]?.tag_name || 'v1',
  darkTheme: ({ settings }) => settings?.darkTheme || false,
  transparencyEnabled: ({ settings }) => settings?.transparencyEnabled || false,
  showGameThumbnails: ({ settings }) => settings?.showGameThumbnails || false,
  sortedBoards: ({ boards }) => orderby(boards, 'lastUpdated', 'desc'),
  sortedPublicBoards: ({ publicBoards }) => orderby(publicBoards, 'lastUpdated', 'desc'),
  isBoardOwner: ({ board, user }) => board?.owner === user?.uid,
  navPosition: ({ settings }) => settings?.navPosition || 'top',
  ageRating: ({ settings }) => settings?.ageRating || 'all',

  gameLinks: ({ game }) => {
    return game?.websites?.map(({ url, category }) => ({ url, ...LINKS_CATEGORIES[category] })) || [];
  },

  sidebarProps(state) {
    return {
      scrollable: true,
      shadow: true,
      backdrop: true,
      'no-header': true,
      'bg-variant': state.settings?.darkTheme ? 'dark' : 'light',
      'text-variant': state.settings?.darkTheme ? 'light' : 'dark',
    }
  },

  // Arabic is the only ltr language supported at the moment
  isRTL: ({ settings }) => settings?.language !== 'ar',

  gameGenres: (state) => {
    return state.game?.genres?.map((genre) => ({
      ...genre,
        ...GAME_GENRES.find(({ id }) => id === genre.id),
    }));
  },

  gameNews: (state) => {
    const gameNews = state.game?.news?.map((article) => {
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
        date: new Date(article.date * 1000).toLocaleDateString("en-US", { dateStyle: 'short' }),
        contents,
        source: NEWS_SOURCES?.[feedSlug] || `MISING: ${article?.feedname} | ${feedSlug}`,
        tags: article.tags,
      };
    });

    return gameNews;
  },

  gameMedia: (state) => (thumb = false) => {
    const steamVideos = state.game?.steam?.movies?.map((video) => {
      const hiQuality = video?.mp4?.max;
      const lowQuality = video?.mp4?.[480];

      return {
        imageUrl: video.thumbnail,
        videoUrl: hiQuality || lowQuality,
        isVideo: true,
        source: 'Steam',
      }
    }) || [];

    const speedRunVideos = state.game?.speedruns
      ?.map((speedrun) => speedrun?.videos?.links?.[0]?.uri)
      ?.filter((url) => url?.includes('youtube'))
      ?.map((youtubeUrl) => {
        const youtubeId = youtubeUrl?.split('v=')?.[1]

        return {
          imageUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`,
          isVideo: true,
          source: 'YouTube',
        }
      }) || [];

    const igdbVideos = state.game?.videos?.map((video) => {
      return {
        imageUrl: `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/embed/${video.video_id}?rel=0&autoplay=1`,
        isVideo: true,
        source: 'YouTube',
      }
    }) || [];

    const igdbScreenshots = state.game?.screenshots?.map((screenshot) => ({
      imageUrl: getImageUrl(screenshot, thumb ? IMAGE_SIZE_THUMB : IMAGE_SIZE_720P),
      source: 'IGDB',
    })) || [];
    const steamScreenshots = state.game?.steam?.screenshots.map(({ path_full }) => ({ imageUrl: path_full, source: 'Steam' })) || [];

    const gameCover = {
      imageUrl: getImageUrl(state.game, thumb ? IMAGE_SIZE_THUMB : IMAGE_SIZE_COVER_BIG),
      source: 'IGDB',
      isCover: true,
    };

    const wikipediaImages = state.game?.wikipedia?.lead?.image?.urls
      ? [{ imageUrl: Object.values(state.game?.wikipedia?.lead?.image?.urls)?.[0], source: 'Wikipedia' }]
      : [];

    const gogImages = state.game?.gog?.gallery.map((image) => {
      const imageId = image?.split('.com/')?.[1];

      return {
        imageUrl: imageId ? `https://images.gog-statics.com/${imageId}.jpg` : null,
        source: 'GoG',
      };
    }) || [];

    const igdbArtworks = state?.game?.artworks?.map((artwork) => ({ imageUrl: getImageUrl(artwork, IMAGE_SIZE_720P), source: 'IGDB', })) || [];

    // console.log('speedRunVideos', speedRunVideos);

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
  },
};
