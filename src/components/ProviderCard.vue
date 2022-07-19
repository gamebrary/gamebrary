<template lang="html">
  <b-card v-if="provider" style="max-width: 100%; width: 400px;" class="mb-3">
    <b-media>
      <template #aside>
        <b-img
          :src="`/logos/companies/${provider.id}.svg`"
          width="40"
          alt="Provider"
        />
      </template>
      <h4>{{ user.displayName }}</h4>

      <p class="m-0">Logged in {{ lastLogin }} using <strong>{{ provider.name }}</strong>.</p>
    </b-media>
  </b-card>
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
