<template lang="html">
  <div v-if="provider">
    <p>{{ user.displayName }}</p>
    <p>Member since {{ dateJoined }}</p>
    <p>Last login {{ lastLogin }}</p>

    <p>
      Logged in with <strong>{{ provider.name }}</strong>
    </p>
  </div>
</template>

<script>
import { AUTH_PROVIDERS } from '@/constants';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),

    provider() {
      return AUTH_PROVIDERS[this.user.providerId];
    },

    dateJoined() {
      return this.$dayjs(this.user?.dateJoined).format('M/D/YYYY');
    },

    lastLogin() {
      return this.$dayjs(this.user?.lastLogin).format('M/D/YYYY');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
