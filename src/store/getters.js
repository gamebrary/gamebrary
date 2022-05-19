import { AGE_RATING_SYSTEMS } from '@/constants';
import { PLATFORM_CATEGORIES, EXCLUDED_PLATFORMS, PLATFORM_OVERRIDES } from '@/constants/platforms';
import orderby from 'lodash.orderby';

export default {
  sortedBoards: ({ boards }) => orderby(boards, 'name'),

  gameCoverUrl: ({ game }) => {
    return game?.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
      : '/no-image.jpg';
  },

  isBoardOwner: ({ board, user }) => {
    return board?.owner === user?.uid;
  },

  gameTags: ({ tags, game }) => {
    // TODO: refactor architecture, don't use tag name as key
    const tagsArray = Object.entries(tags);
    const filteredTags = tagsArray.filter(([key, value]) => {
      return value.games.includes(game.id);
    });

    const filteredTagsObject = Object.fromEntries(filteredTags);

    return filteredTagsObject;
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

  gameAgeRatings: () => (game) => {
    const ageRatings = game && game.age_ratings;

    if (!ageRatings) return null;

    return ageRatings.map(({ category, rating }) => {
      const { name, ratings } = AGE_RATING_SYSTEMS.find(({ id }) => id === category);

      return { name, rating: ratings[rating] };
    });
  },
};
