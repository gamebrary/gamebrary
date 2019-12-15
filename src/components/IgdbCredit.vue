<template lang="html">
  <a :href="href" class="igdb-credit" target="_blank">
    <img :src="`/static/img/igdb-logo.svg`" >
    <strong>{{ $t('igdbCredit.poweredByIgdb') }}</strong>
  </a>
</template>

<script>
export default {
  props: {
    linkable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
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
  color: var(--primary-text-color);
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
