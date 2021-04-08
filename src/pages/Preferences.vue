<template lang="html">
  <div>
    <div class="d-inline-flex flex-column align-items-start">
      <languages />
      <theme-selector class="mb-2" />

      <div class="border-top w-100 mt-3 mb-4" />

      <provider-card />

      <b-button
        @click="session_signOut"
        variant="outline-info"
        size="sm"
        class="my-2"
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
import ProviderCard from '@/components/ProviderCard';
import DeleteAccount from '@/components/Settings/DeleteAccount';
import SessionMixin from '@/mixins/SessionMixin';
import { mapState } from 'vuex';

export default {
  components: {
    Languages,
    ThemeSelector,
    ProviderCard,
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
