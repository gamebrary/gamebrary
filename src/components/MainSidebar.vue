 <template lang="html">
  <AppSidebar
    id="mainMenu"
    :visible="menuOpen"
    :placement="sidebarLeftProps?.placement || 'start'"
    :bg-variant="sidebarLeftProps?.bgVariant"
    :text-variant="sidebarLeftProps?.textVariant"
    :no-header="true"
    @update:visible="handleVisibilityChange"
    @hidden="hideSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar">
        <router-link :to="{ name: 'home' }">
          <img
            src="/img/gamebrary-logo.png"
            alt="Gamebrary"
            width="200"
            class="pb-1"
          />
        </router-link>
      </SidebarHeader>
    </template>

    <SearchBox class="mx-3" />

    <div class="px-3 pt-3">
      <router-link
        :to="{ name: 'boards' }"
        class="btn d-block btn-lg text-start align-items-center d-flex mb-2"
        :class="routeName === 'boards' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-regular fa-rectangle-list" />
        <span class="ms-2">Boards</span>

        <span v-if="boards.length" class="badge bg-light text-dark ms-auto">
          {{ boards.length }}
        </span>
      </router-link>

      <router-link
        :to="{ name: 'library' }"
        class="btn d-block btn-lg text-start align-items-center d-flex mb-2"
        :class="routeName === 'library' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-regular fa-gamepad fa-fw" />
        <span class="ms-2">Library</span>

        <span v-if="gameCount" class="badge bg-light text-dark ms-auto">
          {{ gameCount }}
        </span>
      </router-link>

      <router-link
        :to="{ name: 'tags' }"
        class="btn d-block btn-lg text-start align-items-center d-flex mb-2"
        :class="routeName === 'tags' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-light fa-tags fa-fw" />
        <span class="ms-2">Tags</span>

        <span v-if="tags.length" class="badge bg-light text-dark ms-auto">
          {{ tags.length }}
        </span>
      </router-link>

      <router-link
        :to="{ name: 'notes' }"
        class="btn d-block btn-lg text-start align-items-center d-flex mb-2"
        :class="routeName === 'notes' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-regular fa-notes fa-fw" />

        <span class="ms-2">Notes</span>

        <span v-if="notesCount" class="badge bg-light text-dark ms-auto">
          {{ notesCount }}
        </span>
      </router-link>

      <router-link
        :to="{ name: 'wallpapers' }"
        class="btn d-block btn-lg text-start align-items-center d-flex mb-2"
        :class="routeName === 'wallpapers' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-solid fa-images fa-fw" />
        <span class="ms-2">Wallpapers</span>

        <span v-if="wallpaperCount" class="badge bg-light text-dark ms-auto">
          {{ wallpaperCount }}
        </span>
      </router-link>

      <ProfileDockMenu />

      <router-link
        :to="{ name: 'settings' }"
        class="btn d-block btn-lg text-start w-100 mb-2"
        :class="routeName === 'settings' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-regular fa-gear fa-fw" />
        <span class="ms-2">Settings</span>
      </router-link>
    </div>

    <template #footer>
      <MainSidebarFooter />
    </template>
  </AppSidebar>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useBoardsStore } from '@/stores/boards';
import { useSettingsStore } from '@/stores/settings';
import { useGamesStore } from '@/stores/games';
import { useNotesStore } from '@/stores/notes';
import { useTagsStore } from '@/stores/tags';
import { useWallpapersStore } from '@/stores/wallpapers';
import { useUIStore } from '@/stores/ui';
import { useReleasesStore } from '@/stores/releases';
import { useAppGetters } from '@/stores/getters';
import { THUMBNAIL_PREFIX } from '@/constants';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SidebarHeader from '@/components/SidebarHeader';
import MainSidebarFooter from '@/components/MainSidebarFooter';
import SearchBox from '@/components/SearchBox';
import AppSidebar from '@/components/AppSidebar';

const route = useRoute();
const userStore = useUserStore();
const boardsStore = useBoardsStore();
const settingsStore = useSettingsStore();
const gamesStore = useGamesStore();
const notesStore = useNotesStore();
const tagsStore = useTagsStore();
const wallpapersStore = useWallpapersStore();
const uiStore = useUIStore();
const releasesStore = useReleasesStore();
const { navPosition, latestRelease, darkTheme, transparencyEnabled, sidebarLeftProps } = useAppGetters();
const $bus = inject('$bus');

// Store state and getters
const user = computed(() => userStore.user);
const board = computed(() => boardsStore.board);
const boards = computed(() => boardsStore.boards);
const settings = computed(() => settingsStore.settings);
const games = computed(() => gamesStore.games);
const notes = computed(() => notesStore.notes);
const tags = computed(() => tagsStore.tags);
const wallpapers = computed(() => wallpapersStore.wallpapers);
const menuOpen = computed(() => uiStore.menuOpen);

// Computed properties
const routeName = computed(() => route?.name);

const variant = computed(() => darkTheme.value ? 'dark' : 'light');

const activeVariant = computed(() => darkTheme.value ? 'success' : 'black');

const gameCount = computed(() => Object.keys(games.value).length);

const notesCount = computed(() => Object.keys(notes.value).length);

const wallpaperCount = computed(() => {
  const filteredWallpapers = wallpapers.value?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));
  return filteredWallpapers.length;
});

// Methods
const handleVisibilityChange = (visible) => {
  uiStore.setMenuOpen(visible);
};

const hideSidebar = () => {
  uiStore.setMenuOpen(false);
};
</script>
