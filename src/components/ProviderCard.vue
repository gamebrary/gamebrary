<template lang="html">
  <b-card v-if="provider" style="max-width: 100%; width: 400px;">
    <b-media right-align vertical-align="center">
      <template #aside>
        <b-img
          :src="`/logos/companies/${provider.id}.svg`"
          width="60"
          alt="Provider"
        />
      </template>
      <h3 class="mt-0 mb-1">{{ user.displayName }}</h3>

      <p>Logged in {{ lastLogin }} using <strong>{{ provider.name }}</strong>.</p>
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
