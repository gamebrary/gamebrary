export const IMAGE_SIZE_1080P = 't_1080p_2x'; // 1920 x 1080	fit, center gravity
export const IMAGE_SIZE_720P = 't_720p_2x'; // 1280 x 720	fit, center gravity
export const IMAGE_SIZE_COVER_BIG = 't_cover_big_2x'; // 264 x 374	fit
export const IMAGE_SIZE_COVER_SMALL = 't_cover_small_2x'; // 90 x 128	fit
export const IMAGE_SIZE_LOGO_MED = 't_logo_med_2x'; // 284 x 160	fit
export const IMAGE_SIZE_MICRO = 't_micro_2x'; // 35 x 35	thumb, center gravity
export const IMAGE_SIZE_SCREENSHOT_BIG = 't_screenshot_big_2x'; // 889 x 500	lfill, center gravity
export const IMAGE_SIZE_SCREENSHOT_HUGE = 't_screenshot_huge_2x'; // 1280 x 720	lfill, center gravity
export const IMAGE_SIZE_SCREENSHOT_MED = 't_screenshot_med_2x'; // 569 x 320	lfill, center gravity
export const IMAGE_SIZE_THUMB = 't_thumb_2x'; // 90 x 90	thumb, center gravity

export const MIN_PROFILE_LENGTH = 6;
export const THUMBNAIL_PREFIX = '_300x300';
export const MAX_PROFILE_LENGTH = 20;
export const STEAM_CATEGORY_ID = 13;
export const GOG_CATEGORY_ID = 17;
export const TWITTER_CATEGORY_ID = 5;
export const NO_IMAGE_PATH = '/no-image.png';

export const LIST_VIEW_SINGLE = 'single';
export const LIST_VIEW_COVERS = 'covers';
export const LIST_VIEW_GRID = 'grid';
export const LIST_VIEW_COMPACT = 'compact';
export const LIST_VIEW_TEXT = 'text';

export const BOARD_TYPE_STANDARD = 'standard';
export const BOARD_TYPE_KANBAN = 'kanban';
export const BOARD_TYPE_TIER = 'tier';

export const SORT_TYPE_ALPHABETICALLY = 'alphabetically';
export const SORT_TYPE_RATING = 'rating';
export const SORT_TYPE_PROGRESS = 'progress';

export const MAX_QUERY_LIMIT = 500;

export const BOARD_TYPES = [
  { text: 'Standard', value: BOARD_TYPE_STANDARD },
  { text: 'Kanban', value: BOARD_TYPE_KANBAN },
  { text: 'Tier', value: BOARD_TYPE_TIER },
];

export const LIST_SORT_OPTIONS = [
  { text: 'Custom', value: null },
  { text: 'Alphabetically', value: SORT_TYPE_ALPHABETICALLY },
  { text: 'Rating', value: SORT_TYPE_RATING },
  { text: 'Progress', value: SORT_TYPE_PROGRESS },
];

export const LIST_VIEW_OPTIONS = [
  { text: 'Default', value: LIST_VIEW_SINGLE },
  { text: 'Covers', value: LIST_VIEW_COVERS },
  { text: 'Grid', value: LIST_VIEW_GRID },
  { text: 'Compact', value: LIST_VIEW_COMPACT },
  { text: 'Text', value: LIST_VIEW_TEXT },
];

export const FEATURED_BOARDS = [
  'wGZ8chO5VK4jOaqG1373',
  'raHXfbMSJtQ9xNT8T6yC',
  'NSmHnEtQbjblUcwNKN0T',
  '022E7O53f6XpvO5VIz8D',
  'xCIeZA1xXOXPM72IBgLo',
  'LeOgZdJHmThKMEOzLn6g'
];

// TODO: get games dynamically
export const TRENDING_GAMES = [
  '112875',
  '144054',
  '17269',
  '112875',
  '200165',
  '119388',
  '96437',
  '191692',
  '125165',
];

export const DEFAULT_BOARD_BASE = {
  name: '',
  ranked: false,
  isPublic: false,
}

export const DEFAULT_BOARD_TIER = {
  ...DEFAULT_BOARD_BASE,
  type: BOARD_TYPE_TIER,
  lists: [
    { name: 'S', games: [], backgroundColor: '#C0382B' },
    { name: 'A', games: [], backgroundColor: '#E84B3C'},
    { name: 'B', games: [], backgroundColor: '#F39C19' },
    { name: 'C', games: [], backgroundColor: '#F2C511' },
    { name: 'D', games: [], backgroundColor: '#27AF60' },
  ],
};

export const DEFAULT_BOARD_STANDARD = {
  ...DEFAULT_BOARD_BASE,
  type: BOARD_TYPE_STANDARD,
  lists: [
    {
      games: [],
    }
  ],
};

export const DEFAULT_BOARD_KANBAN = {
  ...DEFAULT_BOARD_BASE,
  type: BOARD_TYPE_KANBAN,
  lists: [
    {
      name: 'Backlog',
      games: [],
      sortBy: null,
      showTags: false,
      showNotes: false,
      showCount: false,
      view: null,
    },
    {
      name: 'Playing',
      games: [],
      sortBy: null,
      showTags: false,
      showNotes: false,
      showCount: false,
      view: null,
    },
    {
      name: 'Completed',
      games: [],
      sortBy: null,
      showTags: false,
      showNotes: false,
      showCount: false,
      view: null,
    }
  ],
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

export const NEWS_SOURCES = {
  eurogamer: { img: 'eurogamer.png', url: 'https://www.eurogamer.net/', name: 'Eurogamer' },
  vg247: { img: 'vg247.svg', url: 'https://www.vg247.com/', name: 'VG247' },
  rps: { img: 'rps.svg', url: 'https://www.rockpapershotgun.com/', name: 'Rock Paper Shotgun' },
  rockpapershotgun: { img: 'rps.svg', url: 'https://www.rockpapershotgun.com/', name: 'Rock Paper Shotgun' },
  pcgamer: { img: 'pcgamer.png', url: 'https://www.pcgamer.com/', name: 'PC Gamer' },
  pressakeycom: { img: 'pressakey.png', url: 'https://pressakey.com/', name: 'Pressakey.com' },
  pcgamesn: { img: 'pcgamesn.svg', url: 'https://www.pcgamesn.com/', name: 'PCGamesN' },
  steamcommunityannouncements: { img: 'steam.png', url: 'https://steamcommunity.com/', name: 'Steam' },
  shacknews: { img: 'shacknews.png', url: 'https://www.shacknews.com/', name: 'Shacknews' },
  steamdb: { img: 'steamdb.svg', url: 'https://steamdb.info/', name: 'Steam' },
  gamemagru: { img: 'gamemagru.png', url: 'https://gamemag.ru/', name: 'GameMAG' },
  steamrelease: { img: 'steam.png', url: 'https://store.steampowered.com/', name: 'Steam' },
  steamannounce: { img: 'steam.png', url: 'https://store.steampowered.com/', name: 'Steam' },
  gamingonlinux: { img: 'gamingonlinux.svg', url: 'https://www.gamingonlinux.com/', name: 'GamingOnLinux' },
};

export const GENRE_ICONS = {
  2: 'fa-solid fa-computer-mouse',
  4: 'fa-solid fa-hand-fist',
  5: 'fa-solid fa-person-rifle',
  7: 'fa-solid fa-music',
  8: 'fa-solid fa-person-running',
  9: 'fa-solid fa-puzzle-piece',
  10: 'fa-solid fa-flag-checkered',
  12: 'fa-solid fa-shield',
  13: 'fa-solid fa-cube',
  14: 'fa-solid fa-futbol',
  15: 'fa-solid fa-chess',
  16: 'fa-solid fa-arrows-turn-to-dots',
  24: 'fa-solid fa-user-ninja',
  26: 'fa-solid fa-person-circle-question',
  30: 'fa-solid fa-table-tennis-paddle-ball',
  31: 'fa-solid fa-mountain-sun',
  32: 'fa-solid fa-gamepad',
  33: 'fa-solid fa-asterisk',
  35: 'fa-solid fa-chess-board',
  34: 'fa-solid fa-comments',
  36: 'fa-solid fa-network-wired',
};

export const KEYBOARD_SHORTCUTS = {
  'MODAL_keyboard-shortcuts': ['shift', '?'],
  // MODAL_devTools: ['shift', 'd'],
  ROUTE_home: ['shift', 'h'],
  ROUTE_search: ['shift', 'k'],
  ROUTE_tags: ['shift', 't'],
  ROUTE_notes: ['shift', 'n'],
  ROUTE_wallpapers: ['shift', 'w'],
  ROUTE_settings: ['shift', 's'],
};

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

export const AGE_RATING_SYSTEMS = {
  1: {
    id: 'ESRB',
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
  2: {
    id: 'PEGI',
    ratings: {
      1: '3',
      2: '7',
      3: '12',
      4: '16',
      5: '18',
    },
  },
  3: {
    id: 'CERO',
    ratings: {
      13: 'CERO_A',
      14: 'CERO_B',
      15: 'CERO_C',
      16: 'CERO_D',
      17: 'CERO_Z',
    },
  },
  4: {
    id: 'USK',
    ratings: {
      18: 'USK_0',
      19: 'USK_6',
      20: 'USK_12',
      21: 'USK_18',
    },
  },
  5: {
    id: 'GRAC',
    ratings: {
      22: 'GRAC_ALL',
      23: 'GRAC_Twelve',
      24: 'GRAC_Fifteen',
      25: 'GRAC_Eighteen',
      26: 'GRAC_TESTING',
    },
  },
  6: {
    id: 'ClassInd',
    ratings: {
      27: 'ClassInd-L',
      28: 'ClassInd-10',
      29: 'ClassInd-12',
      30: 'ClassInd-14',
      31: 'ClassInd-16',
      32: 'ClassInd-18',
    },
  },
  7: {
    id: 'ACB',
    ratings: {
      33: 'ACB_G',
      34: 'ACB_PG',
      35: 'ACB_M',
      36: 'ACB_MA15',
      37: 'ACB_R18',
      38: 'ACB_RC',
    },
  },
};

export const WEBSITE_CATEGORIES = {
  WIKIPEDIA: 3,
  AMAZON: 20,
};

export const GAME_GENRES = [
  { id: 2, name: 'Point-and-click', slug: 'point-and-click' },
  { id: 4, name: 'Fighting', slug: 'fighting' },
  { id: 5, name: 'Shooter', slug: 'shooter' },
  { id: 7, name: 'Music', slug: 'music' },
  { id: 8, name: 'Platform', slug: 'platform' },
  { id: 9, name: 'Puzzle', slug: 'puzzle' },
  { id: 10, name: 'Racing', slug: 'racing' },
  { id: 11, name: 'Real Time Strategy (RTS)', slug: 'real-time-strategy-rts' },
  { id: 12, name: 'Role-playing (RPG)', slug: 'role-playing-rpg' },
  { id: 13, name: 'Simulator', slug: 'simulator' },
  { id: 14, name: 'Sport', slug: 'sport' },
  { id: 15, name: 'Strategy', slug: 'strategy' },
  { id: 16, name: 'Turn-based strategy (TBS)', slug: 'turn-based-strategy-tbs' },
  { id: 24, name: 'Tactical', slug: 'tactical' },
  { id: 25, name: 'Hack and slash/Beat \'em up', slug: 'hack-and-slash-beat-em-up' },
  { id: 26, name: 'Quiz/Trivia', slug: 'quiz-trivia' },
  { id: 30, name: 'Pinball', slug: 'pinball' },
  { id: 31, name: 'Adventure', slug: 'adventure' },
  { id: 32, name: 'Indie', slug: 'indie' },
  { id: 33, name: 'Arcade', slug: 'arcade' },
  { id: 34, name: 'Visual Novel', slug: 'visual-novel' },
  { id: 35, name: 'Card & Board Game', slug: 'card-and-board-game' },
  { id: 36, name: 'MOBA', slug: 'moba' },
];

export const GAME_THEMES = [
    { id: 1, name: 'Action', slug: 'action' },
    { id: 17, name: 'Fantasy', slug: 'fantasy' },
    { id: 18, name: 'Science fiction', slug: 'science-fiction' },
    { id: 19, name: 'Horror', slug: 'horror' },
    { id: 20, name: 'Thriller', slug: 'thriller' },
    { id: 21, name: 'Survival', slug: 'survival' },
    { id: 22, name: 'Historical', slug: 'historical' },
    { id: 23, name: 'Stealth', slug: 'stealth' },
    { id: 27, name: 'Comedy', slug: 'comedy' },
    { id: 28, name: 'Business', slug: 'business' },
    { id: 31, name: 'Drama', slug: 'drama' },
    { id: 32, name: 'Non-fiction', slug: 'non-fiction' },
    { id: 33, name: 'Sandbox', slug: 'sandbox' },
    { id: 34, name: 'Educational', slug: 'educational' },
    { id: 35, name: 'Kids', slug: 'kids' },
    { id: 38, name: 'Open world', slug: 'open-world' },
    { id: 39, name: 'Warfare', slug: 'warfare' },
    { id: 40, name: 'Party', slug: 'party' },
    { id: 41, name: '4X (explore, expand, exploit, and exterminate)', slug: '4x-explore-expand-exploit-and-exterminate' },
    { id: 42, name: 'Erotic', slug: 'erotic' },
    { id: 43, name: 'Mystery', slug: 'mystery' },
    { id: 44, name: 'Romance', slug: 'romance' },
];

export const GAME_LANGUAGES = [
    { id: 1, name: 'Arabic', nativeName: 'العربية' },
    { id: 2, name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { id: 3, name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { id: 4, name: 'Czech', nativeName: 'čeština' },
    { id: 5, name: 'Danish', nativeName: 'Dansk' },
    { id: 6, name: 'Dutch', nativeName: 'Nederlands' },
    { id: 7, name: 'English', nativeName: 'English (US)' },
    { id: 8, name: 'English (UK)', nativeName: 'English (UK)' },
    { id: 9, name: 'Spanish (Spain)', nativeName: 'Español (España)' },
    { id: 10, name: 'Spanish (Mexico)', nativeName: 'Español (Mexico)' },
    { id: 12, name: 'French', nativeName: 'Français' },
    { id: 14, name: 'Hungarian', nativeName: 'Magyar' },
    { id: 11, name: 'Finnish', nativeName: 'Suomi' },
    { id: 15, name: 'Italian', nativeName: 'Italiano' },
    { id: 13, name: 'Hebrew', nativeName: 'עברית' },
    { id: 16, name: 'Japanese', nativeName: '日本語' },
    { id: 17, name: 'Korean', nativeName: '한국어' },
    { id: 18, name: 'Norwegian', nativeName: 'Norsk' },
    { id: 20, name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)' },
    { id: 21, name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
    { id: 19, name: 'Polish', nativeName: 'Polski' },
    { id: 22, name: 'Russian', nativeName: 'Русский' },
    { id: 24, name: 'Turkish', nativeName: 'Türkçe' },
    { id: 25, name: 'Thai', nativeName: 'ไทย' },
    { id: 26, name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { id: 23, name: 'Swedish', nativeName: 'Svenska' },
    { id: 28, name: 'Ukrainian', nativeName: 'українська' },
    { id: 27, name: 'German', nativeName: 'Deutsch' }
];

export const GAME_PERSPECTIVES = [
  { id: 1, name: 'First person', slug: 'first-person' },
  { id: 2, name: 'Third person', slug: 'third-person' },
  { id: 3, name: 'Bird view / Isometric', slug: 'bird-view-slash-isometric' },
  { id: 5, name: 'Text', slug: 'text' },
  { id: 4, name: 'Side view', slug: 'side-view' },
  { id: 7, name: 'Virtual Reality', slug: 'virtual-reality' },
  { id: 6, name: 'Auditory', slug: 'auditory' }
];

export const GAME_MODES = [
  { id: 1, name: 'Single player', slug: 'single-player' },
  { id: 2, name: 'Multiplayer', slug: 'multiplayer' },
  { id: 3, name: 'Co-operative', slug: 'co-operative' },
  { id: 4, name: 'Split screen', slug: 'split-screen' },
  { id: 5, name: 'Massively Multiplayer Online (MMO)', slug: 'massively-multiplayer-online-mmo' },
  { id: 6, name: 'Battle Royale', slug: 'battle-royale' }
];

export const IGDB_QUERIES = {
  GAME: 'fields *,keywords.*,collection,collection.games.cover.image_id,game_engines.*,remakes.cover.image_id,remasters.cover.image_id,language_supports, artworks.image_id, age_ratings.*, age_ratings.content_descriptions.*, alternative_names.*,bundles.*,bundles.cover.image_id, collection.*, collection.games.*, cover.image_id, external_games.*, game_modes.name, genres.name, involved_companies.company.logo.*, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, name, platforms.platform_logo.*, platforms.id, platforms.name, player_perspectives.name, rating, release_dates.date, release_dates.platform, screenshots.image_id, similar_games.id, similar_games.cover.image_id, similar_games.slug, similar_games.name, slug, summary, videos.video_id, websites.category, websites.url, themes.*;',
  PLATFORMS: 'fields category,generation,name,alternative_name,slug,platform_logo.*; limit 300;',
  COMPANY: 'fields id,description,developed.name,developed.slug,developed.cover.*,logo.*,name,published.name,published.slug,published.cover.*,websites.*,slug;',
  SEARCH: 'fields name,platforms,slug,rating,cover.image_id;',
}