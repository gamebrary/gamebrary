<template lang="html">
  <b-container class="pt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Settings</h3>
    </div>

    <languages />
    <theme-selector />

    <hr />

    <b-button
      href="https://accounts.google.com/"
      class="mb-2"
      target="_blank"
      variant="info"
    >
      Manage Google Account
    </b-button>

    <br />
    <delete-account class="mb-2" />
    <br />
    <sign-out />
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
