<template lang="html">
  <b-container>
    <page-title
      title="Profiles"
    />

    <router-link
      class="bg-white p-3 mb-2"
      :to="{ name: 'public-profile', params: { userName: profile.userName } }"
      v-for="profile in profiles"
      :key="profile.userName"
    >
      <small>{{ profile.userName }}</small>
    </router-link>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['profiles']),
  },

  mounted() {
    this.loadProfiles();
  },

  methods: {
    loadProfiles() {
      this.$store.dispatch('LOAD_PROFILES');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
