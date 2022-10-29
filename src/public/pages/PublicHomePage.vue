<template lang="html">
  <div class="d-flex flex-column">
    <h1 class="display-5 mt-5 mb-3 mx-5 text-center">Gamebrary</h1>

    <div class="mb-5 field ml-auto mr-auto text-center mb-auto">
      <div class="lead text-primary">
        <p>Organize</p>
        <p>Track progress</p>
        <p>Take notes</p>
        <p>Learn</p>
        <p>Read news</p>
        <p>Discover</p>
      </div>

      <b-button
        variant="info"
        class="mt-3"
        :to="{ name: 'explore' }"
      >
        Check it out
      </b-button>

      <p class="small mt-2 text-muted">Free and open source!</p>
    </div>

    <footer class="text-muted text-center py-5">
      <router-link class="px-1" :to="{ name: 'about' }">About</router-link>
      <router-link class="px-1" :to="{ name: 'privacy.policy' }">Privacy</router-link>
      <router-link class="px-1" :to="{ name: 'terms' }">Terms</router-link>
      <br />
      ©{{ year }} Gamebrary
    </footer>
  </div>
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
