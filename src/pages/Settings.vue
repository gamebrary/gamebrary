<template lang="html">
  <b-container>
    <h3 class="m-0">Settings</h3>

    <div class="d-inline-flex flex-column align-items-start">
      <languages />

      <theme-selector class="mb-2" />

      <b-button
        href="https://accounts.google.com/"
        class="mb-2 mt-4"
        target="_blank"
        variant="info"
      >
        Manage Google Account
      </b-button>

      <sign-out class="mb-2" />
      <delete-account />
    </div>
  </b-container>
</template>

<script>
import Languages from '@/components/Settings/Languages';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import SignOut from '@/components/Settings/SignOut';
import DeleteAccount from '@/components/Settings/DeleteAccount';
import { mapGetters } from 'vuex';

export default {
  components: {
    Languages,
    ThemeSelector,
    SignOut,
    DeleteAccount,
  },

  computed: {
    ...mapGetters(['darkTheme']),
  },

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    },
  },
};
</script>
