<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3>Profiles</h3>
    </portal>

    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <masonry
        v-else
        gutter="1rem"
        :cols="{default: 4, 1000: 3, 700: 2, 400: 1}"
      >
        <profile-card
          v-for="profile in profiles"
          :key="profile.userName"
          :profile="profile"
        />
      </masonry>
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
