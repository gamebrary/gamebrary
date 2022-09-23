<template lang="html">
  <section>
    <b-container>
      <page-title
        title="Profiles"
      />

      <b-button
        :to="{ name: 'public.profile', params: { userName: profile.userName } }"
        block
        class="profile-button p-2"
        v-for="profile in profiles"
        :key="profile.userName"
      >
        <div>
          <!-- TODO: put profile card in component -->
          <!-- TODO: show avatar -->
          <b-avatar></b-avatar>
          <h1>{{ profile.displayName }}</h1>
          <small class="text-info">{{ `@${profile.userName}` }}</small>
          <p v-if="profile.bio">{{ profile.bio }}</p>
        </div>
      </b-button>
    </b-container>
  </section>
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
