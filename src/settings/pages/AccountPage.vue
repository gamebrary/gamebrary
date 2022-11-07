<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Account</portal>

      <profile-form />

      <div class="field centered" v-if="user">
        <hr class="py-2" />
        <p>Logged in as:</p>
        <p>{{ user.displayName }} / {{ user.email }}</p>

        <b-alert show class="field" variant="light">
          <small>
            <strong>User ID:</strong>
            {{ user.uid }}
          </small>
        </b-alert>

        <b-button
          variant="light"
          @click="session_signOut"
        >
          Log out
        </b-button>

        <hr class="py-2" />

        <b-button
          variant="link"
          class="text-danger mb-5"
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
import { mapState } from 'vuex';

import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  mixins: [sessionMixin],

  components: {
    DeleteAccountModal,
    ProfileForm,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
