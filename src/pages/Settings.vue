<template lang="html">
  <b-container>
    <b-row>
      <b-col cols="12" sm="6" class="mt-4 mt-sm-0 mb-3">
        <b-list-group>
          <b-list-group-item :variant="darkTheme ? 'info' : null">
            <strong>{{ user.displayName }}</strong>
            <p class="text-muted m-0">{{ user.email }}</p>
          </b-list-group-item>

          <b-list-group-item :variant="darkTheme ? 'dark' : null">
            <strong>Date Joined</strong>
            <p class="text-muted m-0">{{ formatDate(user.dateJoined) }}</p>
          </b-list-group-item>

          <b-list-group-item :variant="darkTheme ? 'info' : null">
            <strong>Last login</strong>
            <p class="text-muted m-0">{{ formatDate(user.lastLogin) }}</p>
          </b-list-group-item>

          <b-list-group-item :variant="darkTheme ? 'dark' : null">
            <strong>Email Verified</strong>
            <p class="text-muted m-0">{{ user.emailVerified ? 'Yes' : 'No' }}</p>
          </b-list-group-item>

          <b-list-group-item :variant="darkTheme ? 'info' : null">
            <strong>ID</strong>
            <p class="text-muted m-0 mb-2">{{ user.uid }}</p>

            <b-alert show>You can safely share this id when reporting bugs</b-alert>
          </b-list-group-item>
        </b-list-group>
      </b-col>

      <b-col cols="12" sm="6">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="m-0">Settings</h3>
        </div>

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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Languages from '@/components/Settings/Languages';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import SignOut from '@/components/Settings/SignOut';
import DeleteAccount from '@/components/Settings/DeleteAccount';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    Languages,
    ThemeSelector,
    SignOut,
    DeleteAccount,
  },

  computed: {
    ...mapState(['settings', 'user']),
    ...mapGetters(['darkTheme']),
  },

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    },
  },
};
</script>
