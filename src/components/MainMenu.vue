<!-- TODO: get better (and) colorized icons for active state -->
<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<!-- TODO: rename to menu, dock, or similar -->
<template lang="html">
  <b-sidebar
    id="mainMenu"
    shadow
    no-header
    backdrop
    width="380px"
    :visible="menuOpen"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
    @hidden="hideSidebar"
  >
    <template #default>
      <ProfileDockMenu />

      <SearchBox class="m-3" />

      <div class="p-3">
        <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          block
          :to="{ name: 'boards' }"
        >
          <i class="fa-regular fa-rectangle-list" />
          <span class="ml-2">Boards</span>
        </b-button>

        <!-- TODO: find a place to show public boards -->
        <!-- <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          block
          :to="{ name: 'public.boards' }"
        >
          <i class="fa-solid fa-users-rectangle fa-fw" />
          <span class="ml-2">Public boards</span>
        </b-button> -->

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


        <SettingsDockMenu class="mr-1" />
      </div>

      <!-- TODO: find place for close button, maybe only needed for mobile? -->
      <!-- <b-button
        @click="hideSidebar"
      >
        <i class="fa-regular fa-xmark"></i>
      </b-button> -->

      <!-- <b-button 
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
      </b-button> -->

      
    </template>

    <template #footer>
      <div class="text-center p-3 d-flex justify-content-between small">
        <div class="d-flex justify-content-between align-items-center">
          <img
            src="/logo.png"
            alt=""
            height="26"
            class="mr-2"
          />

          &copy; {{ currentYear }} Gamebrary
        </div>

        <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          size="sm"
          @click="signOut"
        >
          <i class="fa-regular fa-right-from-bracket fa-fw" />
          Sign out
        </b-button>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import SettingsDockMenu from '@/components/Dock/SettingsDockMenu';
import TagsDockMenu from '@/components/Dock/TagsDockMenu';
import GamesDockMenu from '@/components/Dock/GamesDockMenu';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
    ProfileDockMenu,
    SettingsDockMenu,
    TagsDockMenu,
    GamesDockMenu,
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

    async signOut() {
			await this.$store.dispatch('SIGN_OUT');
			this.$bvToast.toast('Logged out');
			this.$store.commit('CLEAR_SESSION');
			this.$router.replace({ name: 'home' });
		},
  }
};
</script>
