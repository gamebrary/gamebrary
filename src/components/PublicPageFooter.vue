<template lang="html">
  <footer class="text-muted text-center py-5">
    <router-link class="px-1" :to="{ name: 'about' }">About</router-link>
    <router-link class="px-1" :to="{ name: 'privacy.policy' }">Privacy</router-link>
    <router-link class="px-1" :to="{ name: 'terms' }">Terms</router-link>
    <router-link class="px-1" :to="{ name: 'releases' }">Releases</router-link>
    <br />
    ©{{ year }} Gamebrary
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>
