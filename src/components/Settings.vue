<template lang="html">
  <b-navbar-nav class="ml-auto" v-if="user">
    <b-dropdown
      variant="link"
      toggle-class="text-decoration-none p-0"
      no-caret
      right
    >
      <template v-slot:button-content>
        <b-avatar
          v-if="user && user.photoURL"
          variant="info"
          :src="user.photoURL"
        />
      </template>

      <tags-settings />
      <wallpaper-settings />
      <language />
      <b-dropdown-divider />
      <releases />
      <themes />
      <about />
      <b-dropdown-divider />
      <account-settings />
      <sign-out />
    </b-dropdown>
  </b-navbar-nav>
</template>

<script>
import TagsSettings from '@/components/Settings/TagsSettings';
import AccountSettings from '@/components/Settings/AccountSettings';
import WallpaperSettings from '@/components/Settings/WallpaperSettings';
import Releases from '@/components/Settings/Releases';
import Themes from '@/components/Settings/Themes';
import Language from '@/components/Settings/Language';
import SignOut from '@/components/Settings/SignOut';
import About from '@/components/Settings/About';
import { mapState } from 'vuex';

export default {
  components: {
    TagsSettings,
    AccountSettings,
    WallpaperSettings,
    Releases,
    Themes,
    Language,
    SignOut,
    About,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
