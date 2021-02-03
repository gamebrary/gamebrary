// import { PLATFORM_FILTER_FIELDS } from '@/constants';
import orderby from 'lodash.orderby';

export default {
  nightMode: state => Boolean(state.settings && state.settings.nightMode),
  sortedBoards: ({ boards }) => orderby(boards, 'name'),

  filteredPlatforms: (state) => {
    // const filterField = state.settings && state.settings.platformsFilterField
    //   ? state.settings.platformsFilterField
    //   : null;

    // const sortField = state.settings && state.settings.platformsSortField
    //   ? state.settings.platformsSortField
    //   : 'generation';

    // let filteredPlatforms = [];
    //
    // if (filterField === 'all') {
    //   filteredPlatforms = state.platforms;
    // } else {
    //   filteredPlatforms = filterField && PLATFORM_FILTER_FIELDS.includes(filterField)
    //     ? state.platforms.filter(({ category }) => category === filterField)
    //     : filteredPlatforms = state.platforms.filter(({ popular }) => popular);
    // }

    const sortedPlatforms = orderby(state.platforms, ['popular', 'generation']);
    // const sortedPlatforms = orderby(filteredPlatforms, sortField);

    return sortedPlatforms.reverse();

    // const reverseOrder = ['releaseYear', 'generation'].includes(sortField);
    //
    // return reverseOrder
    //   ? sortedPlatforms.reverse()
    //   : sortedPlatforms;
  },

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

  gameTags: state => Object.keys(state.tags) && Object.keys(state.tags).length > 0,
};
