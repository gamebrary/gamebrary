<template lang="html">
  <!-- TODO: remove v-if -->
  <section v-if="user">
    <b-container>
      <portal to="pageTitle">Account</portal>

      <profile-form />

      <div class="field centered">
        <b-button
          :variant="darkTheme ? 'secondary' : 'light'"
          class="mr-2"
          @click="session_signOut"
        >
          Log out
        </b-button>

        <b-button
          variant="outline-danger"
          @click="$bvModal.show('deleteAccount');"
        >
          Delete account
        </b-button>

        <delete-account-modal />
      </div>
    </b-container>
  </section>
</template>

<script>
import sessionMixin from '@/mixins/sessionMixin';
import ProfileForm from '@/components/ProfileForm'
import { mapState, mapGetters } from 'vuex';

import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  mixins: [sessionMixin],

  components: {
    DeleteAccountModal,
    ProfileForm,
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
