<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3>Profiles</h3>
    </portal>

    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <div class="profiles-grid">
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.userName"
          :profile="profile"
        />
      </div>
    </b-container>
  </section>
</template>

<script>
import ProfileCard from '@/components/ProfileCard';
import { mapState } from 'vuex';

export default {
  components: {
    ProfileCard,
  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapState(['profiles']),
  },

  mounted() {
    this.loadProfiles();
  },

  methods: {
    async loadProfiles() {
      try {
        this.loading = true;
        await this.$store.dispatch('LOAD_PROFILES');
      } catch (e) {
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.profiles-grid {
  width: 100%;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);

  @media(max-width: 1280px) {grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 992px) {grid-template-columns: repeat(1, 1fr); }
}
</style>
