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
import TagsSettings from '@/components/Settings/TagsSettings';
import AccountSettings from '@/components/Settings/AccountSettings';
import Releases from '@/components/Settings/Releases';
import BoardSettings from '@/components/Settings/BoardSettings';
import SignOut from '@/components/Settings/SignOut';
import About from '@/components/Settings/About';
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
      return this.$route.name === 'board';
    },
  },
};
</script>
