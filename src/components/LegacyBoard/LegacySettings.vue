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

      <template v-if="isBoard">
        <board-settings />
        <b-dropdown-divider />
      </template>

      <tags-settings />
      <account-settings />
      <releases />
      <about />
      <b-dropdown-divider />
      <!-- language -->
      <!-- theme -->
      <sign-out />
    </b-dropdown>
  </b-navbar-nav>
</template>

<script>
import TagsSettings from '@/components/LegacyBoard/LegacyTagsSettings';
import AccountSettings from '@/components/LegacyBoard/LegacyAccountSettings';
import Releases from '@/components/LegacyBoard/LegacyReleases';
import BoardSettings from '@/components/LegacyBoard/LegacyBoardSettings';
import SignOut from '@/components/LegacyBoard/LegacySignOut';
import About from '@/components/LegacyBoard/LegacyAbout';
import { mapState } from 'vuex';

export default {
  components: {
    TagsSettings,
    AccountSettings,
    Releases,
    BoardSettings,
    SignOut,
    About,
  },

  computed: {
    ...mapState(['user']),

    isBoard() {
      return this.$route.name === 'legacy-board';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
