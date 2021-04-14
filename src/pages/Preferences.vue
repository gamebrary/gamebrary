<template lang="html">
  <div>
    <div class="d-inline-flex flex-column align-items-start">
      <languages />
      <theme-selector class="mb-2" />

      <br>

      Open games in:
      <b-form-select v-model="gameDetailView" class="mb-3">
        <b-form-select-option value="modal">Modal</b-form-select-option>
        <b-form-select-option value="side">Side panel</b-form-select-option>
        <b-form-select-option value="new">New page</b-form-select-option>
      </b-form-select>

      Dock position:
      <b-form-select v-model="gameDetailView" class="mb-3">
        <b-form-select-option value="top">Top</b-form-select-option>
        <b-form-select-option value="left">Left</b-form-select-option>
        <b-form-select-option value="bottom">Bottom</b-form-select-option>
      </b-form-select>

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
