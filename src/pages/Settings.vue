<template lang="html">
  <b-container>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Settings</h3>
    </div>

    <languages />
    <theme-selector />

    <b-list-group>
      <b-list-group-item :variant="darkTheme ? 'dark' : null">
        <strong>{{ user.displayName }}</strong>
        <p class="text-muted m-0">{{ user.email }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="darkTheme ? 'dark' : null">
        <strong>Date Joined</strong>
        <p class="text-muted m-0">{{ formatDate(user.dateJoined) }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="darkTheme ? 'dark' : null">
        <strong>Last login</strong>
        <p class="text-muted m-0">{{ formatDate(user.lastLogin) }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="darkTheme ? 'dark' : null">
        <strong>Email Verified</strong>
        <p class="text-muted m-0">{{ user.emailVerified ? 'Yes' : 'No' }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="darkTheme ? 'dark' : null">
        <strong>ID</strong>
        <p class="text-muted m-0 mb-2">{{ user.uid }}</p>

        <b-alert show>You can safely share this id when reporting bugs</b-alert>
      </b-list-group-item>
    </b-list-group>

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

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    },
  },
};
</script>
