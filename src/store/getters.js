import { PLATFORM_FILTER_FIELDS } from '@/constants';
import platforms from '@/platforms';
import orderby from 'lodash.orderby';

export default {
  gamePlatforms: (state) => {
    const gamePlatforms = state.game && state.game.platforms
      ? state.game.platforms.map(platform => platform.id)
      : null;

    return platforms.filter(({ id }) => id !== state.platform.id && gamePlatforms.includes(id));
  },

  sortedBoards: ({ boards }) => orderby(boards, 'name'),

  filteredPlatforms: (state) => {
    const filterField = state.settings.platformsFilterField || null;
    const sortField = state.settings.platformsSortField || 'generation';

    let filteredPlatforms = [];

    if (filterField === 'all') {
      filteredPlatforms = state.platforms;
    } else {
      filteredPlatforms = filterField && PLATFORM_FILTER_FIELDS.includes(filterField)
        ? state.platforms.filter(({ category }) => category === filterField)
        : filteredPlatforms = state.platforms.filter(({ popular }) => popular);
    }

    const sortedPlatforms = orderby(filteredPlatforms, sortField);

    const reverseOrder = ['releaseYear', 'generation'].includes(sortField);

    return reverseOrder
      ? sortedPlatforms.reverse()
      : sortedPlatforms;
  },

  platformNames: (state) => {
    const formattedPlatforms = {};

    state.platforms.forEach(({ id, slug, logoFormat, name }) => {
      formattedPlatforms[id] = {
        name,
        slug,
        logoFormat,
      };
    });

    return formattedPlatforms;
  },

  // eslint-disable-next-line
  activeList: ({ gameLists, platform, activeListIndex }) => gameLists[platform.code][activeListIndex],

  gameTags: state => Object.keys(state.tags) && Object.keys(state.tags).length > 0,
};
