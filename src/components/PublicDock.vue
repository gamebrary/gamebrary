<template lang="html">
  <nav>
    <router-link :to="{ name: 'home' }">
      <img
        src="/gamebrary-logo.png"
        width="32"
      />
    </router-link>

    <public-menu />
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import PublicMenu from '@/components/PublicMenu';

export default {
  components: {
    PublicMenu,
  },

  computed: {
    ...mapState(['settings']),

    dockPosition() {
      return this.settings && this.settings.dockPosition;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  padding: .25rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
