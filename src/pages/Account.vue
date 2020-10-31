<template lang="html">
  <div>
    <b-jumbotron
      header="Account"
      header-level="5"
      :bg-variant="nightMode ? 'dark' : ''"
      :text-variant="nightMode ? 'white' : ''"
      :border-variant="nightMode ? 'dark' : ''"
      fluid
    />

    <b-container>
      <b-list-group flush>
        <b-list-group-item variant="dark">
          <b-avatar
            v-if="user && user.photoURL"
            size="xl"
            variant="info"
            :src="user.photoURL"
          />

          <br />

          <strong>{{ user.displayName }}</strong>
          <p class="text-muted m-0">{{ user.email }}</p>
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <strong>Date Joined</strong>
          <p class="text-muted m-0">{{ formatDate(user.dateJoined) }}</p>
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <strong>Last login</strong>
          <p class="text-muted m-0">{{ formatDate(user.lastLogin) }}</p>
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <strong>Email Verified</strong>
          <p class="text-muted m-0">{{ user.emailVerified ? 'Yes' : 'No' }}</p>
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <strong>ID</strong>
          <p class="text-muted m-0 mb-2">{{ user.uid }}</p>

          <b-alert show>You can safely share this id when reporting bugs</b-alert>
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <b-button href="https://accounts.google.com/" target="_blank" variant="secondary">
            Manage Google Account
          </b-button>
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <delete-account />
        </b-list-group-item>

        <b-list-group-item variant="dark">
          <sign-out />
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </div>
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
