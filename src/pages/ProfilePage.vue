<template lang="html">
  <b-container>
    <page-title title="Profile settings" />

    <b-row>
      <b-col cols="6">
        <div v-if="loading">
          loading...
        </div>

        <empty-state
          v-else-if="isEmpty"
          title="Profiles"
          message="Share boards with other users, get your own shareable URL, and more!"
        >
          <create-profile />
        </empty-state>

        <public-profile v-else />
      </b-col>

      <b-col>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import CreateProfile from '@/components/Profile/CreateProfile';
import PublicProfile from '@/components/PublicProfile';
import { mapState } from 'vuex';

export default {
  components: {
    EmptyState,
    CreateProfile,
    PublicProfile,
  },

  data() {
    return {
      saving: false,
      loading: true,
    };
  },

  computed: {
    ...mapState(['user', 'profile']),

    isEmpty() {
      return Object.keys(this.profile).length === 0;
    },
  },

  async mounted() {
    await this.$store.dispatch('LOAD_PROFILE')
      .catch(() => {
        this.loading = false;
      });

    this.loading = false;
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
