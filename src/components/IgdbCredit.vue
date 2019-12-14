<template lang="html">
  <a
    :href="href"
    class="igdb-credit"
    target="_blank"
    v-if="this.settings[this.platform.code].theme != 'touch'"
  >
    <img :src="`/static/img/igdb-logo.svg`" >
    <strong>{{ $t('igdbCredit.poweredByIgdb') }}</strong>
  </a>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    linkable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['platform', 'settings']),

    href() {
      return this.linkable
        ? 'https://www.igdb.com/'
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.igdb-credit {
  color: #fff;
  background: #3eb87a;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 10px;

  img {
    height: 34px;
  }
}
</style>
