<!-- TODO: get better (and) colorized icons for active state -->
<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<!-- TODO: rename to menu, dock, or similar -->
<!-- TODO: put login/logout button at top right corner -->
<template lang="html">
  <b-sidebar
    id="mainMenu"
    shadow
    no-header
    backdrop
    sidebar-class="p-3"
    width="380px"
    :visible="menuOpen"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
    @hidden="hideSidebar"
  >
    <template #default>
      <!-- TODO: find place for close button, maybe only needed for mobile? -->
      <!-- <b-button
        @click="hideSidebar"
      >
        <i class="fa-regular fa-xmark"></i>
      </b-button> -->

      <b-button 
        v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
        :variant="darkTheme ? 'dark' : 'light'"
        title="Home"
        block
        :to="{ name: 'home' }"
      > 
        <img
          src="/logo.png"
          alt=""
          height="26"
        />

        Gamebrary
      </b-button>

      <ProfileDockMenu />
      <BoardsDockMenu />
      <GamesDockMenu />
      <TagsDockMenu />
      
      <b-button
        block
        :variant="darkTheme ? 'dark' : 'light'"
        :to="{ name: 'create.note' }"
      >
      <i class="fa-regular fa-note-medical"></i>
        <span class="ml-2">New note</span>
      </b-button>

      <b-button
        :to="{ name: 'notes' }"
        :variant="darkTheme ? 'dark' : 'light'"
        block
      >
        <i class="fa-regular fa-notes"></i>

        <span class="ml-2">My notes</span>
      </b-button>
      
      <b-button
        :variant="darkTheme ? 'dark' : 'light'"
        :to="{ name: 'wallpapers' }"
        block
      >
      <i class="fa-solid fa-images"></i>
        <span class="ml-2">Wallpapers</span>
      </b-button>

      <UploadWallpaperButton />

      <SettingsDockMenu class="mr-1" />

      <b-button
        :to="{ name: 'search' }"
        :variant="darkTheme ? 'dark' : 'light'"
        v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
        title="Search"
      >
        <i class="fa-regular fa-search"></i>
      </b-button>
    </template>

    <template #footer>
      <SearchBox />

      <div class="text-center py-3">
        <small>&copy; {{ currentYear }} Gamebrary</small>
        <!-- <b-button size="sm" @click="hideSidebar">Close</b-button> -->
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import BoardsDockMenu from '@/components/Dock/BoardsDockMenu';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SettingsDockMenu from '@/components/Dock/SettingsDockMenu';
import TagsDockMenu from '@/components/Dock/TagsDockMenu';
import GamesDockMenu from '@/components/Dock/GamesDockMenu';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
    UploadWallpaperButton,
    BoardsDockMenu,
    ProfileDockMenu,
    SettingsDockMenu,
    TagsDockMenu,
    GamesDockMenu,
  },

  data() {
    return {
      avatarImage: null,
    }
  },

  computed: {
    ...mapState(['user', 'board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled']),

    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    hideSidebar() {
      this.$store.commit('SET_MENU_OPEN', false);
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
