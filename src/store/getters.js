import { NEWS_SOURCES, LINKS_CATEGORIES, EXCLUDED_PLATFORMS, IMAGE_SIZE_SCREENSHOT_HUGE } from '@/constants';
import { getImageUrl } from '@/utils';
import slugify from 'slugify'
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
import orderby from 'lodash.orderby';
import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkify-html';

export default {
  latestRelease: ({ releases }) => releases?.[0]?.tag_name || 'v1',
  darkTheme: ({ settings }) => settings?.darkTheme || false,
  sortedBoards: ({ boards }) => orderby(boards, 'lastUpdated', 'desc'),

  isBoardOwner: ({ board, user }) => {
    return board?.owner === user?.uid;
  },

  gameLinks: ({ game }) => {
    return game?.websites?.map(({ url, category }) => ({ url, ...LINKS_CATEGORIES[category] }));
  },

  // Arabic is the only ltr language supported at the moment
  isRTL: ({ settings }) => settings?.language !== 'ar',

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

  gameMedia: (state) => {
    const steamVideos = state.game?.steam?.movies?.map((video) => {
      const hiQuality = video?.mp4?.max;
      const lowQuality = video?.mp4?.[480];

      return {
        imageUrl: video.thumbnail,
        videoUrl: hiQuality || lowQuality,
        isVideo: true,
        source: 'steam',
      }
    }) || [];

    const igdbVideos = state.game?.videos?.map((video) => {
      return {
        imageUrl: `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/embed/${video.video_id}?rel=0&autoplay=1`,
        isVideo: true,
        source: 'youtube',
      }
    }) || [];

    const igdbScreenshots = state.game?.screenshots?.map((screenshot) => ({ imageUrl: getImageUrl(screenshot, IMAGE_SIZE_SCREENSHOT_HUGE), source: 'igdb', })) || [];
    const steamScreenshots = state.game?.steam?.screenshots.map(({ path_full }) => ({ imageUrl: path_full, source: 'steam' })) || [];

    const gameCover = {
      imageUrl: getImageUrl(state.game),
      source: 'igdb',
      isCover: true,
    };

    const wikipediaImages = state.game?.wikipedia?.lead?.image?.urls
      ? [{ imageUrl: Object.values(state.game?.wikipedia?.lead?.image?.urls)?.[0], source: 'wikipedia' }]
      : [];

    const gogImages = state.game?.gog?.gallery.map((image) => {
      const imageId = image.split('.com/')[1];

      return {
        imageUrl: imageId ? `https://images.gog-statics.com/${imageId}.jpg` : null,
        source: 'gog',
      };
    }) || [];

    const igdbArtworks = state?.game?.artworks?.map((artwork) => ({ imageUrl: getImageUrl(artwork, IMAGE_SIZE_SCREENSHOT_HUGE), source: 'igdb', })) || [];

    return [
      ...gogImages,
      ...steamScreenshots,
      ...igdbScreenshots,
      ...igdbArtworks,
      ...wikipediaImages,
      gameCover,
      ...igdbVideos,
      ...steamVideos,
    ];
  },
};
