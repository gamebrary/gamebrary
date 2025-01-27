 <template lang="html">
  <b-sidebar
    id="mainMenu"
    :visible="menuOpen"
    v-bind="sidebarLeftProps"
    @hidden="hideSidebar"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide">
        <router-link :to="{ name: 'home' }">
          <img
            src="/img/gamebrary-logo.png"
            alt="Gamebrary"
            width="200"
            class="pb-1"
          />
        </router-link>
      </SidebarHeader>

      <SearchBox class="mx-3" />

      <div class="px-3 pt-3">
        <b-button
          :variant="routeName === 'boards' ?  activeVariant : variant"
          block
          size="lg"
          class="text-left align-items-center d-flex"
          :to="{ name: 'boards' }"
        >
          <i class="fa-regular fa-rectangle-list" />
          <span class="ml-2">Boards</span>

          <b-badge v-if="boards.length" class="ml-auto" variant="light">
            {{ boards.length }}
          </b-badge>
        </b-button>

        <b-button
          :variant="routeName === 'games' ?  activeVariant : variant"
          :to="{ name: 'games' }"
          block
          size="lg"
          class="text-left align-items-center d-flex"
        >
          <i class="fa-regular fa-gamepad fa-fw" />
          <span class="ml-2">Games</span>

          <b-badge v-if="gameCount" class="ml-auto" variant="light">
            {{ gameCount }}
          </b-badge>
        </b-button>

        <b-button
          :to="{ name: 'tags' }"
          :variant="routeName === 'tags' ?  activeVariant : variant"
          class="text-left align-items-center d-flex"
          size="lg"
          block
        >
          <i class="fa-light fa-tags fa-fw" />
          <span class="ml-2">Tags</span>

          <b-badge v-if="tags.length" class="ml-auto" variant="light">
            {{ tags.length }}
          </b-badge>
        </b-button>

        <b-button
          :to="{ name: 'notes' }"
          :variant="routeName === 'notes' ?  activeVariant : variant"
          class="text-left align-items-center d-flex"
          block
          size="lg"
        >
          <i class="fa-regular fa-notes fa-fw" />

          <span class="ml-2">Notes</span>

          <b-badge v-if="notesCount" class="ml-auto" variant="light">
            {{ notesCount }}
          </b-badge>
        </b-button>

        <b-button
          :variant="routeName === 'wallpapers' ?  activeVariant : variant"
          :to="{ name: 'wallpapers' }"
          class="text-left align-items-center d-flex"
          block
          size="lg"
        >
        <i class="fa-solid fa-images fa-fw" />
          <span class="ml-2">Wallpapers</span>

          <b-badge v-if="wallpaperCount" class="ml-auto" variant="light">
            {{ wallpaperCount }}
          </b-badge>
        </b-button>

        <ProfileDockMenu />

        <b-button
          block
          class="text-left"
          :variant="routeName === 'settings' ?  activeVariant : variant"
          size="lg"
          @click="openSettingsSidebar"
        >
          <i class="fa-regular fa-gear fa-fw" />
          <span class="ml-2">Settings</span>
        </b-button>
      </div>
    </template>

    <template #footer>
      <MainSidebarFooter />
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { THUMBNAIL_PREFIX } from '@/constants';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SidebarHeader from '@/components/SidebarHeader';
import MainSidebarFooter from '@/components/MainSidebarFooter';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
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
