import { AGE_RATING_SYSTEMS } from '@/constants';
import { PLATFORM_CATEGORIES, EXCLUDED_PLATFORMS, PLATFORM_OVERRIDES } from '@/constants/platforms';
import orderby from 'lodash.orderby';

export default {
  sortedBoards: ({ boards }) => orderby(boards, 'name'),
  activeGameCoverUrl: ({ activeGame, games }) => {
    const gameId = activeGame && activeGame.gameId;
    const game = games[gameId];
    const hasImageId = game && game.cover && game.cover.image_id;

    return hasImageId
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
      : '/no-image.jpg';
  },

  isBoardOwner: ({ board, user }) => {
    const boardOwner = board && board.owner;
    const userId = user && user.uid;

    return boardOwner === userId;
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

  gameTags: state => Object.keys(state.tags) && Object.keys(state.tags).length > 0,
};
