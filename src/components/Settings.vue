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
      <account-settings />
      <file-settings />
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
import FileSettings from '@/components/Settings/FileSettings';
import Releases from '@/components/Settings/Releases';
import SignOut from '@/components/Settings/SignOut';
import About from '@/components/Settings/About';
import { mapState } from 'vuex';

export default {
  components: {
    TagsSettings,
    AccountSettings,
    FileSettings,
    Releases,
    SignOut,
    About,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
