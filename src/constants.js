export const POPULAR_PLATFORMS = [169, 167, 130, 48, 49, 41];

export const DEFAULT_LIST_VIEW = 'single';
export const MIN_PROFILE_LENGTH = 6;
export const MAX_PROFILE_LENGTH = 32;

export const PLATFORM_CATEGORIES = {
  1: 'console',
  2: 'arcade',
  3: 'platform',
  4: 'operating_system',
  5: 'portable_console',
  6: 'computer',
};

export const AUTH_PROVIDERS = {
  'google.com': { name: 'Google', id: 'google' },
  'twitter.com': { name: 'Twitter', id: 'twitter' },
  password: { name: 'Gamebrary (Email)', id: 'gamebrary' },
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
  1: { id: 'official', icon: 'fas fa-link' },
  2: { id: 'fandom', svg: true },
  3: { id: 'wikipedia', svg: true },
  4: { id: 'facebook', svg: true },
  5: { id: 'twitter', svg: true },
  6: { id: 'twitch', svg: true },
  8: { id: 'instagram', svg: true },
  9: { id: 'youtube', svg: true },
  10: { id: 'iphone', svg: true },
  11: { id: 'ipad', svg: true },
  12: { id: 'android', svg: true },
  13: { id: 'steam', svg: true },
  14: { id: 'reddit', svg: true },
  15: { id: 'itch', svg: true },
  16: { id: 'epicgames', svg: true },
  17: { id: 'gog', svg: true },
  18: { id: 'discord', svg: true },
};

export const KEYBOARD_SHORTCUTS = {
  'MODAL_keyboard-shortcuts': ['shift', '?'],
  'MODAL_create-board': ['shift', 'c'],
  MODAL_devTools: ['shift', 'd'],
  ROUTE_boards: ['shift', 'b'],
  ROUTE_tags: ['shift', 't'],
  ROUTE_notes: ['shift', 'n'],
  ROUTE_wallpapers: ['shift', 'w'],
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
  380: 'png',
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
  100,
  101,
  102,
  103,
  104,
  105,
  106,
  107,
  108,
  109,
  110,
  111,
  112,
  113,
  115,
  116,
  118,
  121,
  122,
  125,
  126,
  127,
  129,
  131,
  133,
  134,
  135,
  138,
  139,
  140,
  141,
  142,
  142,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  203,
  236,
  237,
  238,
  239,
  240,
  274,
  308,
  339,
  372,
  372,
  373,
  374,
  375,
  376,
  44,
  52, // Arcade
  55,
  69,
  73,
  74,
  79, // Neogeo
  82,
  85,
  89,
  91,
  95,
  96,
  97,
  97,
  98,
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

export const GAME_DETAIL_VIEWS = [
  // { name: 'popup', value: 'popup' },
  { name: 'Modal', value: null },
  { name: 'Side panel', value: 'side' },
  { name: 'New page', value: 'new' },
];

// Source: https://api-docs.igdb.com/#age-rating
export const AGE_RATING_SYSTEMS = [
  {
    name: 'ESRB',
    value: 'ESRB',
    id: 1,
    logo: 'esrb.svg',
    ratings: {
      6: 'RP',
      7: 'EC',
      8: 'E',
      9: 'E10',
      10: 'T',
      11: 'M',
      12: 'AO',
    },
  },
  {
    name: 'PEGI',
    value: 'PEGI',
    id: 2,
    logo: 'pegi.svg',
    ratings: {
      1: '3',
      2: '7',
      3: '12',
      4: '16',
      5: '18',
    },
  },
  {
    name: 'CERO',
    value: 'CERO',
    id: 3,
    logo: 'cero.png',
    ratings: {
      13: 'CERO_A',
      14: 'CERO_B',
      15: 'CERO_C',
      16: 'CERO_D',
      17: 'CERO_Z',
    },
  },
  {
    name: 'USK',
    value: 'USK',
    id: 4,
    logo: 'usk.svg',
    ratings: {
      18: 'USK_0',
      19: 'USK_6',
      20: 'USK_12',
      21: 'USK_18',
    },
  },
  {
    name: 'GRAC',
    value: 'GRAC',
    id: 5,
    logo: '',
    ratings: {
      22: 'GRAC_ALL',
      23: 'GRAC_Twelve',
      24: 'GRAC_Fifteen',
      25: 'GRAC_Eighteen',
      26: 'GRAC_TESTING',
    },
  },
  {
    name: 'ClassInd',
    value: 'CLASS_IND',
    id: 6,
    logo: 'classind.png',
    ratings: {
      27: 'ClassInd-L',
      28: 'ClassInd-10',
      29: 'ClassInd-12',
      30: 'ClassInd-14',
      31: 'ClassInd-16',
      32: 'ClassInd-18',
    },
  },
  {
    name: 'ACB',
    value: 'ACB',
    id: 7,
    logo: 'acb.png',
    ratings: {
      33: 'ACB_G',
      34: 'ACB_PG',
      35: 'ACB_M',
      36: 'ACB_MA15',
      37: 'ACB_R18',
      38: 'ACB_RC',
    },
  },
];

export const DOCK_POSITIONS = [
  { name: 'Top', value: null },
  { name: 'Left', value: 'left' },
  { name: 'Bottom', value: 'bottom' },
  { name: 'Right', value: 'right' },
];
