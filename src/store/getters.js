// import { PLATFORM_FILTER_FIELDS } from '@/constants';
import orderby from 'lodash.orderby';

export default {
  sortedBoards: ({ boards }) => orderby(boards, 'name'),
  activeGameCoverUrl: ({ activeGame, games }) => {
    const gameId = activeGame && activeGame.gameId;
    const game = games[gameId];
    const hasImageId = game && game.cover && game.cover.image_id;

    return hasImageId
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
      : '/static/no-image.jpg';
  },

  isBoardOwner: ({ board, user }) => {
    const boardOwner = board && board.owner;
    const userId = user && user.uid;

    return boardOwner === userId;
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
