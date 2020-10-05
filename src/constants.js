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
  {
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    value: 'af',
  },
  {
    name: 'Albanian',
    nativeName: 'Shqip',
    value: 'sq',
  },
  {
    name: 'Arabic',
    nativeName: 'عربي',
    value: 'ar',
  },
  {
    name: 'Armenian',
    nativeName: 'Հայերէն',
    value: 'hy',
  },
  {
    name: 'Azerbaijani',
    nativeName: 'آذربایجان دیلی',
    value: 'az',
  },
  {
    name: 'Basque',
    nativeName: 'Euskara',
    value: 'eu',
  },
  {
    name: 'Belarusian',
    nativeName: 'Беларуская',
    value: 'be',
  },
  {
    name: 'Bulgarian',
    nativeName: 'Български',
    value: 'bg',
  },
  {
    name: 'Catalan',
    nativeName: 'Català',
    value: 'ca',
  },
  {
    name: 'Chinese (Simplified)',
    nativeName: '中文简体',
    value: 'zh-CN',
  },
  {
    name: 'Chinese (Traditional)',
    nativeName: '中文繁體',
    value: 'zh-TW',
  },
  {
    name: 'Croatian',
    nativeName: 'Hrvatski',
    value: 'hr',
  },
  {
    name: 'Czech',
    nativeName: 'Čeština',
    value: 'cs',
  },
  {
    name: 'Danish',
    nativeName: 'Dansk',
    value: 'da',
  },
  {
    name: 'Dutch',
    nativeName: 'Nederlands',
    value: 'nl',
  },
  {
    name: 'English',
    nativeName: 'English',
    value: 'en',
  },
  {
    name: 'Estonian',
    nativeName: 'Eesti keel',
    value: 'et',
  },
  {
    name: 'Filipino',
    nativeName: 'Filipino',
    value: 'tl',
  },
  {
    name: 'Finnish',
    nativeName: 'Suomi',
    value: 'fi',
  },
  {
    name: 'French',
    nativeName: 'Français',
    value: 'fr',
  },
  {
    name: 'Galician',
    nativeName: 'Galego',
    value: 'gl',
  },
  {
    name: 'Georgian',
    nativeName: 'ქართული',
    value: 'ka',
  },
  {
    name: 'German',
    nativeName: 'Deutsch',
    value: 'de',
  },
  {
    name: 'Greek',
    nativeName: 'Ελληνικά',
    value: 'el',
  },
  {
    name: 'Haitian Creole',
    nativeName: 'Kreyòl ayisyen',
    value: 'ht',
  },
  {
    name: 'Hebrew',
    nativeName: 'עברית',
    value: 'iw',
  },
  {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    value: 'hi',
  },
  {
    name: 'Hungarian',
    nativeName: 'Magyar',
    value: 'hu',
  },
  {
    name: 'Icelandic',
    nativeName: 'Íslenska',
    value: 'is',
  },
  {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    value: 'id',
  },
  {
    name: 'Irish',
    nativeName: 'Gaeilge',
    value: 'ga',
  },
  {
    name: 'Italian',
    nativeName: 'Italiano',
    value: 'it',
  },
  {
    name: 'Japanese',
    nativeName: '日本語',
    value: 'ja',
  },
  {
    name: 'Korean',
    nativeName: '한국어',
    value: 'ko',
  },
  {
    name: 'Latvian',
    nativeName: 'Latviešu',
    value: 'lv',
  },
  {
    name: 'Lithuanian',
    nativeName: 'Lietuvių kalba',
    value: 'lt',
  },
  {
    name: 'Macedonian',
    nativeName: 'Македонски',
    value: 'mk',
  },
  {
    name: 'Malay',
    nativeName: 'Malay',
    value: 'ms',
  },
  {
    name: 'Maltese',
    nativeName: 'Malti',
    value: 'mt',
  },
  {
    name: 'Norwegian',
    nativeName: 'Norsk',
    value: 'no',
  },
  {
    name: 'Persian',
    nativeName: 'فارسی',
    value: 'fa',
  },
  {
    name: 'Polish',
    nativeName: 'Polski',
    value: 'pl',
  },
  {
    name: 'Portuguese',
    nativeName: 'Português',
    value: 'pt',
  },
  {
    name: 'Romanian',
    nativeName: 'Română',
    value: 'ro',
  },
  {
    name: 'Russian',
    nativeName: 'Русский',
    value: 'ru',
  },
  {
    name: 'Serbian',
    nativeName: 'Српски',
    value: 'sr',
  },
  {
    name: 'Slovak',
    nativeName: 'Slovenčina',
    value: 'sk',
  },
  {
    name: 'Slovenian',
    nativeName: 'Slovensko',
    value: 'sl',
  },
  {
    name: 'Spanish',
    nativeName: 'Español',
    value: 'es',
  },
  {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    value: 'sw',
  },
  {
    name: 'Swedish',
    nativeName: 'Svenska',
    value: 'sv',
  },
  {
    name: 'Thai',
    nativeName: 'ไทย',
    value: 'th',
  },
  {
    name: 'Turkish',
    nativeName: 'Türkçe',
    value: 'tr',
  },
  {
    name: 'Ukrainian',
    nativeName: 'Українська',
    value: 'uk',
  },
  {
    name: 'Urdu',
    nativeName: 'اردو',
    value: 'ur',
  },
  {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    value: 'vi',
  },
  {
    name: 'Welsh',
    nativeName: 'Cymraeg',
    value: 'cy',
  },
  {
    name: 'Yiddish',
    nativeName: 'ייִדיש',
    value: 'yi',
  },
];
