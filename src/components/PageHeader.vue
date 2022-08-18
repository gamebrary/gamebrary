<template lang="html">
  <header class="p-2 d-flex">
    <b-button
      title="Dashboard"
      size="sm"
      class="mr-2"
      variant="transparent"
      :to="{ name: 'home' }"
    >
      <img
        src="/logo.png"
        width="20"
      />
    </b-button>

    <portal-target name="pageTitle" slim />

    <div class="align-items-center d-flex ml-auto">
      <portal-target name="headerActions" />

      <!-- <b-button v-if="user" class="mr-2" variant="success" :to="{ name: 'upgrade' }">
        Upgrade
      </b-button> -->

      <b-button
        v-if="showSearchButton"
        variant="light"
        class="mr-2"
        :to="{ name: 'search' }"
      >
        <i class="fas fa-search fa-fw" aria-hidden />
      </b-button>

      <router-link
        v-if="user"
        class="mr-2"
        :to="{ name: 'settings' }"
      >
        <b-avatar size="38" rounded :src="user.photoURL" />
      </router-link>

      <b-button
        v-else
        class="mr-3"
        variant="dark"
        :to="{ name: 'auth' }"
      >
        Login
      </b-button>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'boards', 'user', 'game']),

    showSearchButton() {
      return this.$route.name !== 'search';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  header {
    display: grid;
    align-items: center;
    grid-template-columns: 65px 1fr;
    z-index: 1;
  }
</style>
