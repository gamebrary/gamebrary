import { AGE_RATING_SYSTEMS } from '@/constants';
import { PLATFORM_CATEGORIES, EXCLUDED_PLATFORMS, PLATFORM_OVERRIDES } from '@/constants/platforms';
import { NEWS_SOURCES } from '@/constants';
import slugify from 'slugify'
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
import orderby from 'lodash.orderby';

export default {
  sortedBoards: ({ boards }) => orderby(boards, 'name'),

  isBoardOwner: ({ board, user }) => {
    return board?.owner === user?.uid;
  },

  // Arabic is the only ltr language supported at the moment
  isRTL: ({ settings }) => settings && settings.language !== 'ar',

  platformNames: (state) => {
    const formattedPlatforms = {};

    if (!state.platforms) {
      return [];
    }

    state.platforms.forEach(({ id, slug, logoFormat, name }) => {
      formattedPlatforms[id] = {
        name,
        slug,
        logoFormat,
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

      // TODO: fix broken images from rockpapershotgun

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
};
