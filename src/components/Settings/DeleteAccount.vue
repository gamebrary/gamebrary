<template lang="html">
  <b-button variant="danger" v-b-modal:account-settings>
    Delete Account

    <b-modal
      id="account-settings"
      hide-footer
      body-class="p-0"
      title="Delete account"
    >
      <!-- TODO: delete Boards -->
      <!-- TODO: delete Files -->
      <!-- TODO: delete Tags -->
      <!-- TODO: delete Notes -->
      <!-- TODO: delete Progresses -->
      <!-- TODO: delete Settings -->
      <!-- TODO: delete Tags -->

      <b-button variant="danger" @click="promptDeleteAccount">
        Delete Account
      </b-button>
    </b-modal>
  </b-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },

  methods: {
    promptDeleteAccount() {
      this.$bvModal.msgBoxConfirm('All your data will be removed', {
        title: 'Are you sure you want to delete your account?',
        okVariant: 'danger',
        okTitle: 'Yes, delete account',
      })
        .then((value) => {
          if (value) {
            this.deleteAccount();
          }
        });
    },

    deleteAccount() {
      // const db = firebase.firestore();
      //
      // // TODO: Add progress bar, delete tags, files, etc...
      // // TODO: move to actions
      // db.collection('settings').doc(this.user.uid).delete()
      //   .then(() => {
      //   // TODO: move to actions
      //     db.collection('lists').doc(this.user.uid).delete()
      //       .then(() => {
      //         this.$bvToast.toast('Account deleted', { title: 'Success', variant: 'success' });
      //         const exitUrl = process.env.NODE_ENV === 'development'
      //           ? 'http://localhost:3000'
      //           : 'https://gamebrary.com';
      //
      //         this.$store.commit('CLEAR_SESSION');
      //         window.location.href = exitUrl;
      //       })
      //       .catch(() => {
      //         this.$store.commit('SET_SESSION_EXPIRED', true);
      //       });
      //   })
      //   .catch(() => {
      //     this.$store.commit('SET_SESSION_EXPIRED', true);
      //   });
    },
  },
};
</script>
