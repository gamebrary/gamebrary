import { NEWS_SOURCES, LINKS_CATEGORIES, PLATFORM_CATEGORIES, EXCLUDED_PLATFORMS, PLATFORM_OVERRIDES } from '@/constants';
import { getGameCoverUrl } from '@/utils';
import slugify from 'slugify'
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
import orderby from 'lodash.orderby';

export default {
  sortedBoards: ({ boards }) => orderby(boards, 'name'),

  isBoardOwner: ({ board, user }) => {
    return board?.owner === user?.uid;
  },

  gameLinks: ({ game }) => {
    return game?.websites?.map(({ url, category }) => ({ url, ...LINKS_CATEGORIES[category] }));
  },

  // Arabic is the only ltr language supported at the moment
  isRTL: ({ settings }) => settings && settings.language !== 'ar',

  platformNames: (state) => {
    const formattedPlatforms = {};

    if (!state.platforms) {
      return [];
    }

    state.platforms?.forEach(({ id, slug, name }) => {
      formattedPlatforms[id] = {
        name,
        slug,
      };
    });

    return formattedPlatforms;
  },

  gameNews: (state) => {
    const gameNews = state.game?.news.map((article) => {
      const feedSlug = slugify(article?.feedname, {
        replacement: '',
        lower: true,
        strict: true,
      });

      return {
        title: article.title,
        id: article.gid,
        url: article.url,
        author: article?.author || null,
        date: new Date(article.date * 1000).toLocaleDateString("en-US", { dateStyle: 'short' }),
        contents: bbobHTML(article.contents, presetHTML5()),
        source: NEWS_SOURCES?.[feedSlug] || `MISING: ${article?.feedname} | ${feedSlug}`,
        tags: article.tags,
      };
    });

    return gameNews;
  },

  platforms: (state) => {
    const platforms = state.platforms
      .filter(({ id }) => !EXCLUDED_PLATFORMS.includes(id))
      .map(platform => ({
        // ...platform,
        id: platform.id,
        generation: platform.generation,
        name: platform.name,
        slug: platform.slug,
        category: PLATFORM_CATEGORIES[platform.category],
        ...PLATFORM_OVERRIDES[platform.id],
      }));

    return platforms;
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
        imageUrl: `https://img.youtube.com/vi/${video.video_id}/default.jpg`,
        videoUrl: `https://www.youtube.com/embed/${video.video_id}?rel=0&autoplay=1`,
        isVideo: true,
        source: 'youtube',
      }
    }) || [];

    const igdbScreenshots = state.game?.screenshots?.map(({ image_id }) => ({ imageUrl: `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${image_id}.jpg`, source: 'igdb', })) || [];
    const steamScreenshots = state.game?.steam?.screenshots.map(({ path_full }) => ({ imageUrl: path_full, source: 'steam' })) || [];

    const gameCover = {
      imageUrl: getGameCoverUrl(state.game),
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

    return [
      ...steamScreenshots,
      ...igdbScreenshots,
      ...gogImages,
      ...wikipediaImages,
      gameCover,
      ...igdbVideos,
      ...steamVideos,
    ];
  },
};
