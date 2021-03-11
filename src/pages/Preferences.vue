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

      <sign-out class="mb-2" />
      <delete-account />
    </div>
  </div>
</template>

<script>
import Languages from '@/components/Settings/Languages';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import SignOut from '@/components/Settings/SignOut';
import DeleteAccount from '@/components/Settings/DeleteAccount';

export default {
  components: {
    Languages,
    ThemeSelector,
    SignOut,
    DeleteAccount,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
