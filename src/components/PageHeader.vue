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

    <div class="align-items-center d-flex ml-auto mr-2">
      <portal-target name="headerActions" />

      <!-- <b-button v-if="user" class="mr-2" variant="success" :to="{ name: 'upgrade' }">
        Upgrade
      </b-button> -->

      <search-box />

      <b-button
        v-if="!user"
        class="mr-2"
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
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
  },

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
