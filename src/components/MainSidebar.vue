<template lang="html">
  <b-sidebar
    id="mainMenu"
    :visible="menuOpen"
    v-bind="sidebarProps"
    @hidden="hideSidebar"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide">
        <img
          src="/logo.png"
          alt="Gamebrary"
          height="38"
        />
      </SidebarHeader>

      <ProfileDockMenu />

      <SearchBox class="mx-3 mt-3" />

      <div class="p-3">
        <b-button
          :variant="routeName === 'boards' ? 'primary' : darkTheme ? 'dark' : 'light'"
          block
          :to="{ name: 'boards' }"
        >
          <i class="fa-regular fa-rectangle-list" />
          <span class="ml-2">Boards</span>
        </b-button>

        <b-button
          :variant="routeName === 'games' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'games' }"
          block
        >
        <i class="fa-regular fa-gamepad fa-fw" />
          Games
        </b-button>

        <b-button
          block
          :variant="routeName === 'tags' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'tags' }"
        >
          <i class="fa-light fa-tags fa-fw" />
          <span class="ml-2">Tags</span>
        </b-button>

        <b-button
          :to="{ name: 'notes' }"
          :variant="routeName === 'notes' ? 'primary' : darkTheme ? 'dark' : 'light'"
          block
        >
          <i class="fa-regular fa-notes"></i>

          <span class="ml-2">Notes</span>
        </b-button>

        <b-button
          :variant="routeName === 'wallpapers' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'wallpapers' }"
          block
        >
        <i class="fa-solid fa-images"></i>
          <span class="ml-2">Wallpapers</span>
        </b-button>

        <b-button
          block
          :variant="routeName === 'settings' ? 'primary' : darkTheme ? 'dark' : 'light'"
          v-b-toggle.settingsSidebar
        >
          <i class="fa-regular fa-gear fa-fw" />
          Settings
        </b-button>
      </div>
    </template>

    <template #footer>
      <DockFooter />
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SidebarHeader from '@/components/SidebarHeader';
import DockFooter from '@/components/Dock/DockFooter';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
    ProfileDockMenu,
    SidebarHeader,
    DockFooter,
  },

  computed: {
    ...mapState(['user', 'board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled', 'sidebarProps']),

    routeName() {
      return this.$route?.name;
    },
  },

  methods: {
    hideSidebar() {
      this.$store.commit('SET_MENU_OPEN', false);
    },
  }
};
</script>
