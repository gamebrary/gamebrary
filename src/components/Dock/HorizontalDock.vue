<template lang="html">
  <nav class="d-flex align-items-center justify-content-between p-2">
    <div class="d-flex">
      <router-link :to="{ name: 'home' }">
        <img
          src="/static/gamebrary-logo.png"
          width="32"
        />
      </router-link>

      <portal-target name="logo" />
    </div>

    <div class="d-flex">
      <global-search class="ml-2" />
      <portal-target name="dock" multiple />
      <user-menu />
    </div>


    <!-- <span v-if="!isBoard" class="m-2">
      <portal-target name="pageTitle" />
    </span> -->
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
