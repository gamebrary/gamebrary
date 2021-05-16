<template lang="html">
  <b-container>
    <page-title
      title="Profiles"
    />

    <b-button
      :to="{ name: 'public-profile', params: { userName: profile.userName } }"
      block
      class="profile-button p-2"
      v-for="profile in profiles"
      :key="profile.userName"
    >
      <img
        :src="profile.profileImage"
        :alt="profile.userName"
        class="rounded"
        width="50"
      >

      <div>
        <h3 class="m-0">{{ profile.displayName }}</h3>
        <small class="text-info">{{ `@${profile.userName}` }}</small>
        <p>{{ profile.bio }}</p>
        <!-- <b-button variant="primary">
          Follow
        </b-button> -->
      </div>
    </b-button>
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
.profile-button {
  text-align: left;
  display: grid;
  grid-template-columns: 48px auto;
  grid-gap: .75rem;
}
</style>
