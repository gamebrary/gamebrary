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

      <button
        type="button"
        class="btn d-block btn-lg text-start w-100 mb-2"
        :class="routeName === 'settings' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
        @click="openSettingsSidebar"
      >
        <i class="fa-regular fa-gear fa-fw" />
        <span class="ms-2">Settings</span>
      </button>
    </div>

    <template #footer>
      <MainSidebarFooter />
    </template>
  </AppSidebar>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { THUMBNAIL_PREFIX } from '@/constants';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SidebarHeader from '@/components/SidebarHeader';
import MainSidebarFooter from '@/components/MainSidebarFooter';
import SearchBox from '@/components/SearchBox';
import AppSidebar from '@/components/AppSidebar';

const route = useRoute();
const store = useStore();
const $bus = inject('$bus');

// Store state and getters
const user = computed(() => store.state.user);
const board = computed(() => store.state.board);
const boards = computed(() => store.state.boards);
const settings = computed(() => store.state.settings);
const games = computed(() => store.state.games);
const notes = computed(() => store.state.notes);
const tags = computed(() => store.state.tags);
const wallpapers = computed(() => store.state.wallpapers);
const menuOpen = computed(() => store.state.menuOpen);
const navPosition = computed(() => store.getters.navPosition);
const latestRelease = computed(() => store.getters.latestRelease);
const darkTheme = computed(() => store.getters.darkTheme);
const transparencyEnabled = computed(() => store.getters.transparencyEnabled);
const sidebarLeftProps = computed(() => store.getters.sidebarLeftProps);

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
  store.commit('SET_MENU_OPEN', visible);
};

const hideSidebar = () => {
  store.commit('SET_MENU_OPEN', false);
};

const openSettingsSidebar = () => {
  if ($bus) {
    $bus.$emit('bv::toggle::collapse', 'settings-sidebar');
  }
  hideSidebar();
};
</script>
