import platforms from '@/platforms';

export default {
  gamePlatforms: (state) => {
    const gamePlatforms = state.game && state.game.platforms
      ? state.game.platforms.map(platform => platform.id)
      : null;

    return platforms.filter(({ id }) => id !== state.platform.id && gamePlatforms.includes(id));
  },

  gameNote: ({ game, notes }) => {
    const gameSelected = game && game.id;
    const hasNote = gameSelected && notes[game.id];

    return hasNote
      ? notes[game.id]
      : '';
  },

  // eslint-disable-next-line
  gameProgress: ({ game, progresses, platform }) => {
    const gameSelected = game && game.id;
    const hasProgress = gameSelected
      && platform
      && progresses[platform.code]
      && progresses[platform.code][game.id];

    return hasProgress
      ? progresses[platform.code][game.id]
      : null;
  },

  // eslint-disable-next-line
  activeList: ({ gameLists, platform, activeListIndex }) => gameLists[platform.code][activeListIndex],

  gameTags: state => Object.keys(state.tags) && Object.keys(state.tags).length > 0,
};
