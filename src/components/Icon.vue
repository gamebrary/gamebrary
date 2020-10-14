<template lang="html">
  <img
    :src="`static/octicons/${name}.svg`"
    :class="{ white, animated, small, invert: nightMode }"
  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    name: {
      type: String,
      default: 'sun',
    },
    white: Boolean,
    animated: Boolean,
    small: Boolean,
  },

  computed: {
    ...mapGetters(['nightMode']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@keyframes spin {
    from { transform:rotate(0deg); }
    to { transform:rotate(360deg); }
}

img {
  &.white {
    filter: invert(1);
  }

  width: 22px;
  height: 22px;

  &.small {
    width: 16px;
    height: 16px;
  }

  &.invert {
    filter: invert(1);
  }

  &.animated {
    animation: spin 500ms linear infinite;
    transform:rotate(360deg);
  }
}
</style>
