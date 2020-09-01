<template lang="html">
  <b-dropdown-item v-b-modal:account-settings>
    <b-icon-person class="mr-1" />
    Account

    <b-modal
      id="account-settings"
      hide-footer
      body-class="p-0"
      title="Account"
    >
      <account />
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import Account from '@/components/Settings/Account';

export default {
  components: {
    Account,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
