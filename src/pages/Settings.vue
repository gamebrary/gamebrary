<template lang="html">
  <b-container class="pt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Settings</h3>
    </div>

    <languages />
    <theme-selector />

    <hr />

    <b-button href="https://accounts.google.com/" target="_blank" variant="secondary">
      Manage Google Account
    </b-button>

    <delete-account />
    <sign-out />

    <hr />

    <b-list-group>
      <b-list-group-item :to="{ name: 'about' }">
        <i class="fas fa-info fa-fw" aria-hidden />
        About
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'releases' }">
        <i class="fas fa-bullhorn fa-fw" aria-hidden />
        Releases
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import Languages from '@/components/Settings/Languages';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import SignOut from '@/components/Settings/SignOut';
import DeleteAccount from '@/components/Settings/DeleteAccount';
import { mapState } from 'vuex';

export default {
  components: {
    Languages,
    ThemeSelector,
    SignOut,
    DeleteAccount,
  },

  computed: {
    ...mapState(['settings', 'user']),
  },
};
</script>
