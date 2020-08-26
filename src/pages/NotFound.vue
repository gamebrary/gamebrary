<template lang="html">
  <div
    class="d-flex align-items-center justify-content-center"
    :style="`height: calc(100vh - 58px)`"
    >
    <b-card
      class="sw-100 w-30"
      body-class="text-center"
      sub-title="404"
      :title="$t('global.pageNotFound')"
    >
    </b-card>
  </div>
</template>

<script>
export default {
  computed: {
    homeUrl() {
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://app.gamebrary.com';
    },
  },
};
</script>
