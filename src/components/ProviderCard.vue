<template lang="html">
  <div v-if="provider" class="d-flex flex-column border border-light rounded p-2">
    <p class="lead mb-0">{{ user.displayName }}</p>
    <small>Member since {{ dateJoined }}</small>
    <small>Last login {{ lastLogin }}</small>

    <small class="text-success mt-2 pt-2 border-top">
      Logged in with <strong>{{ provider.name }}</strong>
    </small>
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
      return this.user && this.user.dateJoined
        ? this.$dayjs(this.user.dateJoined).format('M/D/YYYY')
        : null;
    },

    lastLogin() {
      return this.user && this.user.lastLogin
        ? this.$dayjs(this.user.lastLogin).format('M/D/YYYY')
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
