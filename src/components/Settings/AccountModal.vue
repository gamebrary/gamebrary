<template lang="html">
  <b-dropdown-item v-b-modal:account-settings title="Account" v-b-tooltip.hover.right>
    <b-icon-person class="mr-1" />
    <span class="d-none d-sm-block">
      Account
    </span>

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
