export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);

  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
};

export const getGameCoverUrl = (game) => {
  return game?.cover?.image_id
    ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
    : '/no-image.jpg';
};
