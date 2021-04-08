<template lang="html">
  <div>
    <div class="d-inline-flex flex-column align-items-start">
      <b-alert show variant="warning" v-if="!user.emailVerified" class="mb-2">
        Your email hasn't been verified.
      </b-alert>

      <languages />

      <theme-selector class="mb-2" />

      <b-button
        v-if="user.providerId === 'google.com'"
        href="https://accounts.google.com/"
        class="mb-2 mt-4"
        target="_blank"
        variant="info"
      >
        Manage Google Account
      </b-button>

      <b-button
        @click="session_signOut"
        variant="info"
        class="mb-2"
      >
        {{ $t('global.signOut') }}
      </b-button>

      <delete-account />
    </div>
  </div>
</template>

<script>
import Languages from '@/components/Settings/Languages';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import DeleteAccount from '@/components/Settings/DeleteAccount';
import SessionMixin from '@/mixins/SessionMixin';
import { mapState } from 'vuex';

export default {
  components: {
    Languages,
    ThemeSelector,
    DeleteAccount,
  },

  mixins: [SessionMixin],

  computed: {
    ...mapState(['user']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
