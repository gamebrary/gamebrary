import { THUMBNAIL_PREFIX, IMAGE_SIZE_COVER_BIG, NO_IMAGE_PATH } from '@/constants';

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);

  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
};

export const getImageUrl = (item, size = IMAGE_SIZE_COVER_BIG, noPlaceholder) => {
  const imageId = item?.logo?.image_id || item?.cover?.image_id || item?.image_id || null;

  if (noPlaceholder && !imageId) return null;

  return imageId
    ? `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.png`
    : NO_IMAGE_PATH;
};

export const getFileExtension = (fileName) => {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getImageThumbnail = (image) => {
  const fileExtension = getFileExtension(image);

  return image?.replace(`.${fileExtension}`, `${THUMBNAIL_PREFIX}.${fileExtension}`);
};

export const setPageTitle = (title) => {
  if (title) document.title = `${title} - Gamebrary`;
};
