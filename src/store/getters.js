// import { PLATFORM_FILTER_FIELDS } from '@/constants';
import orderby from 'lodash.orderby';

export default {
  darkTheme: ({ settings }) => settings && settings.theme && settings.theme === 'dark',
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

  activeGameCoverUrl: ({ gameModalData, games }) => {
    const gameId = gameModalData && gameModalData.gameId;
    const game = games[gameId];
    const hasImageId = game && game.cover && game.cover.image_id;

    return hasImageId
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
      : '/static/no-image.jpg';
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
