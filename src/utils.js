import { THUMBNAIL_PREFIX } from '@/constants';

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);

  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
};

// TODO: rename to something more generic, this also works for companies
export const getGameCoverUrl = (game) => {
  return game?.cover?.image_id
    ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
    : '/no-image.jpg';
};

export const getFileExtension = (fileName) => {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getImageThumbnail = (image) => {
  const fileExtension = getFileExtension(image);

  return image?.replace(`.${fileExtension}`, `${THUMBNAIL_PREFIX}.${fileExtension}`);
};

export const getThumbnailUrl = (game) => {
  return game?.cover?.image_id
    ? `https://images.igdb.com/igdb/image/upload/t_cover_med_2x/${game.cover.image_id}.jpg`
    : '/no-image.jpg';
};

export const setPageTitle = (title) => {
  document.title = `${title} - Gamebrary`;
};
