import { THUMBNAIL_PREFIX } from '@/constants';

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);

  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
};

export const getGameCoverUrl = (imageId, size = 't_cover_big_2x') => {
  return imageId
    ? `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`
    : '/placeholder.gif';
};

export const getFileExtension = (fileName) => {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getImageThumbnail = (image) => {
  const fileExtension = getFileExtension(image);

  return image?.replace(`.${fileExtension}`, `${THUMBNAIL_PREFIX}.${fileExtension}`);
};

export const setPageTitle = (title) => {
  document.title = `${title} - Gamebrary`;
};
