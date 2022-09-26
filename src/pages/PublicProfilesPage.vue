<template lang="html">
  <section>
    <b-container>
      <page-title
        title="Profiles"
      />

      <b-spinner v-if="loading" class="spinner-centered" />

      <div v-else>
        <profile-card
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
      // TODO: add loader
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
