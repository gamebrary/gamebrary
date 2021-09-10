<template lang="html">
  <nav class="bg-danger py-2">
    <router-link :to="{ name: 'home' }">
      <img
        src="/static/gamebrary-logo.png"
        width="32"
      />
    </router-link>

    <aside>
      <portal-target name="logo" />
      <!-- <global-search class="ml-2" /> -->
      <portal-target name="dock" multiple />
      <user-menu vertical />
      <span v-if="!isBoard" class="m-2">
        <portal-target name="pageTitle" />
      </span>
    </aside>
  </nav>
</template>

<script>
import UserMenu from '@/components/UserMenu';

export default {
  components: {
    UserMenu,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}
</style>
