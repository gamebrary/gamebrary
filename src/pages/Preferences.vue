<template lang="html">
  <div>
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

export default {
  components: {
    Languages,
    ThemeSelector,
    DeleteAccount,
  },

  mixins: [SessionMixin],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
