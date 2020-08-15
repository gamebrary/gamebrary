<template lang="html">
  <b-dropdown-item v-b-modal:account-settings>
    <b-icon-person class="mr-1" />
    Account settings

    <b-modal
      id="account-settings"
      hide-footer
      body-class="p-0"
      title="Account settings"
    >
      <b-list-group flush>
        <b-list-group-item>
          <b-row>
            <b-col cols="2">
              <b-avatar
                v-if="user.photoURL"
                size="xl"
                variant="info"
                :src="user.photoURL"
              />
            </b-col>

            <b-col cols="10">
              <strong>{{ user.displayName }}</strong>
              <p class="text-muted m-0">{{ user.email }}</p>
            </b-col>
          </b-row>
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
          <b-button
            variant="secondary"
            @click="signOut"
          >
            {{ $t('settings.signOut') }}
          </b-button>
        </b-list-group-item>

        <b-list-group-item>
          <b-button variant="danger" @click="promptDeleteAccount">
            Delete Account
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import firebase from 'firebase/app';
import moment from 'moment';
import 'firebase/auth';
import { mapState } from 'vuex';

export default {
  props: {
  },

  data() {
    return {
    };
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
              this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
              this.$router.push({ name: 'sessionExpired' });
            });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    signOut() {
      firebase.auth().signOut()
        .then(() => {
          const exitUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://gamebrary.com';

          this.$store.commit('CLEAR_SESSION');
          window.location.href = exitUrl;
        })
        .catch((error) => {
          this.$bvToast.toast(error, { title: 'Error', variant: 'danger' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
