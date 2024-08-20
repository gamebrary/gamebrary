<template lang="html">
  <b-sidebar
    id="mainMenu"
    shadow
    no-header
    backdrop
    :visible="menuOpen"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
    @hidden="hideSidebar"
  >
    <template #default="{ hide }">
      <div class="d-flex align-items-center justify-content-between p-3">
        <img
          src="/logo.png"
          alt="Gamebrary"
          height="38"
        />
        
        <b-button
          @click="hide"
          :variant="darkTheme ? 'black' : 'white'"
        >
          <i class="fa-solid fa-xmark" />
        </b-button>
      </div>

      <ProfileDockMenu />

      <SearchBox class="m-3" />

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
          :to="{ name: 'settings' }"
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
import DockFooter from '@/components/Dock/DockFooter';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
    ProfileDockMenu,
    DockFooter,
  },

  computed: {
    ...mapState(['user', 'board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled']),

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
