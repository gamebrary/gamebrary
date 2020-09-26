<template lang="html">
  <b-container-fluid>
    <b-jumbotron
      header="Account"
      header-level="5"
      fluid
      lead="...<3"
    />

    <b-container>
      <b-list-group flush>
        <b-list-group-item>
          <b-avatar
            v-if="user.photoURL"
            size="xl"
            variant="info"
            :src="user.photoURL"
          />

          <br />

          <strong>{{ user.displayName }}</strong>
          <p class="text-muted m-0">{{ user.email }}</p>
        </b-list-group-item>

        <b-list-group-item>
          <strong>Date Joined</strong>
          <p class="text-muted m-0">{{ formatDate(user.dateJoined) }}</p>
        </b-list-group-item>

        <b-list-group-item>
          <strong>Last login</strong>
          <p class="text-muted m-0">{{ formatDate(user.lastLogin) }}</p>
        </b-list-group-item>

        <b-list-group-item>
          <strong>Email Verified</strong>
          <p class="text-muted m-0">{{ user.emailVerified ? 'Yes' : 'No' }}</p>
        </b-list-group-item>

        <b-list-group-item>
          <strong>ID</strong>
          <p class="text-muted m-0 mb-2">{{ user.uid }}</p>

          <b-alert show>You can safely share this id when reporting bugs</b-alert>
        </b-list-group-item>

        <b-list-group-item>
          <b-button href="https://accounts.google.com/" target="_blank" variant="secondary">
            Manage Google Account
          </b-button>
        </b-list-group-item>

        <b-list-group-item>
          <b-button variant="danger" @click="promptDeleteAccount">
            Delete Account
          </b-button>
        </b-list-group-item>

        <b-list-group-item>
          <sign-out />
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </b-container-fluid>
</template>

<script>
import firebase from 'firebase/app';
import SignOut from '@/components/Settings/SignOut';
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  components: {
    SignOut,
  },

  computed: {
    ...mapState(['user']),
  },

  methods: {
    formatDate(date) {
      return moment(date).format('LL');
    },

    promptDeleteAccount() {
      this.$bvModal.msgBoxConfirm('All your data will be removed', {
        title: 'Are you sure you want to delete your account?',
        okVariant: 'danger',
        okTitle: 'Yes, delete account! Hahaha!',
      })
        .then((value) => {
          if (value) {
            this.deleteAccount();
          }
        });
    },

    deleteAccount() {
      const db = firebase.firestore();

      // TODO: Add progress bar, delete tags, files, etc...
      // TODO: move to actions
      db.collection('settings').doc(this.user.uid).delete()
        .then(() => {
        // TODO: move to actions
          db.collection('lists').doc(this.user.uid).delete()
            .then(() => {
              this.$bvToast.toast('Account deleted', { title: 'Success', variant: 'success' });
              const exitUrl = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';

              this.$store.commit('CLEAR_SESSION');
              window.location.href = exitUrl;
            })
            .catch(() => {
              this.$store.commit('SET_SESSION_EXPIRED', true);
            });
        })
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },
  },
};
</script>
