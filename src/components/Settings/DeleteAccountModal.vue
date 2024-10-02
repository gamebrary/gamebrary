<template lang="html">
  <b-modal
    id="delete-account-modal"
    :no-close-on-backdrop="deleting"
    :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        v-show="!deleting"
        title="Delete account"
        @close="close"
      />
    </template>

    <div v-if="deleting" class="d-flex flex-column justify-content-center text-center">
      <b-spinner class="mx-auto mb-5" />

      Deleting account, do not close this window...
    </div>

    <div v-else>
      <p>We're sorry to see you go. Please consider submitting feedback before deleting your account.</p>
      <b-button
        variant="primary"
        href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
        target="_blank"
      >
        Submit feedback
      </b-button>

      <p class="mt-3">The following database entries will be deleted FOREVER.</p>

      <ul>
        <li>User profile</li>
        <li>Boards</li>
        <li>Tags</li>
        <li>Notes</li>
        <li>Game Progresses</li>
        <li>Liked games</li>
        <li>Wallpapers</li>
        <li>Avatars</li>
        <li>Settings</li>
      </ul>

      <b-button
        variant="danger"
        @click="deleteAccount"
        :disabled="deleting"
      >
        Delete Account
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      deleting: false,
    };
  },

  computed: {
    ...mapState([
      'user',
      'tags',
      'notes',
      'progresses',
      'settings',
      'boards',
      'wallpapers',
    ]),
    ...mapGetters(['darkTheme']),
  },

  methods: {
    async deleteAccount() {
      this.deleting = true;

      await this.$store.dispatch('DELETE_ACCOUNT');
    },
  },
};
</script>
