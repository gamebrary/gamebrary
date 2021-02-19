export const POPULAR_PLATFORMS = [169, 167, 130, 48, 49, 41];

export const DEFAULT_LIST_VIEW = 'single';

export const PLATFORM_CATEGORIES = {
  1: 'console',
  2: 'arcade',
  3: 'platform',
  4: 'operating_system',
  5: 'portable_console',
  6: 'computer',
};

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
  authDomain: 'gamebrary.com',
  databaseURL: 'https://gamebrary-8c736.firebaseio.com',
  projectId: 'gamebrary-8c736',
  storageBucket: 'gamebrary-8c736.appspot.com',
  messagingSenderId: '324529217902',
};

export const LINKS_CATEGORIES = {
  official: 1,
  wikia: 2,
  wikipedia: 3,
  facebook: 4,
  twitter: 5,
  twitch: 6,
  instagram: 8,
  youtube: 9,
  iphone: 10,
  ipad: 11,
  android: 12,
  steam: 13,
  reddit: 14,
  itch: 15,
  epicgames: 16,
  gog: 17,
  discord: 18,
};

export const KEYBOARD_SHORTCUTS = {
  'MODAL_keyboard-shortcuts': ['shift', '?'],
  'MODAL_create-board': ['shift', 'c'],
  ROUTE_boards: ['shift', 'b'],
  ROUTE_tags: ['shift', 't'],
  ROUTE_notes: ['shift', 'n'],
  ROUTE_wallpapers: ['shift', 'w'],
  ROUTE_profile: ['shift', 'p'],
  ROUTE_settings: ['shift', 's'],
};

export const PLATFORM_FILTER_FIELDS = [
  null,
  'all',
  'console',
  // 'arcade',
  // 'platform',
  'operating_system',
  'portable_console',
  'computer',
];

export const PLATFORM_SORT_FILEDS = [
  'generation',
  'name',
];

export const PLATFORM_BG_HEX = {
  167: '#222',
  166: '#000',
  48: '#2e6db4',
  49: '#177d3e',
  130: '#ce181e',
};

export const LIST_VIEWS = {
  single: 'Single',
  grid: 'Grid',
  compact: 'Compact',
  text: 'Text',
};

export const PLATFORM_LOGO_FORMAT = {
  164: 'png',
  51: 'png',
  47: 'png',
  36: 'png',
  45: 'png',
  124: 'png',
  123: 'png',
  132: 'png',
  160: 'png',
  163: 'png',
  161: 'png',
  165: 'png',
  150: 'png',
};

export const PLATFORM_NAME_OVERRIDES = {
  6: 'Windows',
  18: 'NES',
  19: 'SNES',
  21: 'GameCube',
  150: 'PC Engine CD',
  38: 'PSP',
  163: 'Steam VR',
  50: '3D0',
  99: 'FAMICOM',
  51: 'FAMICOM Disk System',
};

export const EXCLUDED_PLATFORMS = [
  203,
  133,
  151,
  152,
  52, // Arcade
  79, // Neogeo
  153,
  154,
  155,
  156,
  157,
  158,
  134,
  135,
  140,
  141,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  121,
  122,
  125,
  126,
  129,
  131,
  95,
  96,
  97,
  97,
  98,
  100,
  101,
  110,
  111,
  112,
  113,
  115,
  116,
  118,
  102,
  103,
  91,
  104,
  105,
  106,
  107,
  108,
  109,
  127,
  138,
  139,
  142,
  142,
  236,
  237,
  238,
  239,
  240,
  274,
  308,
  339,
  44,
  55,
  69,
  73,
  74,
  82,
  85,
  89,
];

export const SUPPORTED_LANGUAGES = [
  { name: 'Arabic', nativeName: 'عربي', value: 'ar' },
  { name: 'Chinese (Simplified)', nativeName: '中文简体', value: 'zh-CN' },
  { name: 'English', nativeName: 'English', value: 'en' },
  { name: 'French', nativeName: 'Français', value: 'fr' },
  { name: 'German', nativeName: 'Deutsch', value: 'de' },
  { name: 'Italian', nativeName: 'Italiano', value: 'it' },
  { name: 'Japanese', nativeName: '日本語', value: 'ja' },
  { name: 'Portuguese', nativeName: 'Português', value: 'pt' },
  { name: 'Russian', nativeName: 'Русский', value: 'ru' },
  { name: 'Spanish', nativeName: 'Español', value: 'es' },
];
