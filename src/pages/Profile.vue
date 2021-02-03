<template lang="html">
  <b-container class="pt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Profile</h3>
    </div>

    <b-list-group>
      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <strong>{{ user.displayName }}</strong>
        <p class="text-muted m-0">{{ user.email }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <strong>Date Joined</strong>
        <p class="text-muted m-0">{{ formatDate(user.dateJoined) }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <strong>Last login</strong>
        <p class="text-muted m-0">{{ formatDate(user.lastLogin) }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <strong>Email Verified</strong>
        <p class="text-muted m-0">{{ user.emailVerified ? 'Yes' : 'No' }}</p>
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <strong>ID</strong>
        <p class="text-muted m-0 mb-2">{{ user.uid }}</p>

        <b-alert show>You can safely share this id when reporting bugs</b-alert>
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <b-button href="https://accounts.google.com/" target="_blank" variant="secondary">
          Manage Google Account
        </b-button>
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <delete-account />
      </b-list-group-item>

      <b-list-group-item :variant="nightMode ? 'dark' : null">
        <sign-out />
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import SignOut from '@/components/Settings/SignOut';
import DeleteAccount from '@/components/Settings/DeleteAccount';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    SignOut,
    DeleteAccount,
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['nightMode']),
  },

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    },
  },
};
</script>
