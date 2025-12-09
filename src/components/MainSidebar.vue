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
        :to="{ name: 'games' }"
        class="btn d-block btn-lg text-start align-items-center d-flex mb-2"
        :class="routeName === 'games' ? (darkTheme ? 'btn-success' : 'btn-dark') : (darkTheme ? 'btn-dark' : 'btn-light')"
      >
        <i class="fa-regular fa-gamepad fa-fw" />
        <span class="ms-2">Games</span>

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

<script>
import { mapState, mapGetters } from 'vuex';
import { THUMBNAIL_PREFIX } from '@/constants';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SidebarHeader from '@/components/SidebarHeader';
import MainSidebarFooter from '@/components/MainSidebarFooter';
import SearchBox from '@/components/SearchBox';
import AppSidebar from '@/components/Sidebar';

export default {
  components: {
    AppSidebar,
    SearchBox,
    ProfileDockMenu,
    SidebarHeader,
    MainSidebarFooter,
  },

  computed: {
    ...mapState(['user', 'board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled', 'sidebarLeftProps']),

    routeName() {
      return this.$route?.name;
    },

    variant() {
      return this.darkTheme ? 'dark' : 'light';
    },

    activeVariant() {
      return this.darkTheme ? 'success' : 'black';
    },

    gameCount() {
      return Object.keys(this.games).length;
    },

    notesCount() {
      return Object.keys(this.notes).length;
    },

    wallpaperCount() {
      const wallpapers = this.wallpapers?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));

      return wallpapers.length;
    },
  },

  methods: {
    handleVisibilityChange(visible) {
      this.$store.commit('SET_MENU_OPEN', visible);
    },

    hideSidebar() {
      this.$store.commit('SET_MENU_OPEN', false);
    },

    openSettingsSidebar() {
      this.$root.$emit('bv::toggle::collapse', 'settings-sidebar');
      this.hideSidebar();
    },
  }
};
</script>
