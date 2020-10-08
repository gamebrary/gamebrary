<template lang="html">
  <img
    :src="`static/octicons/${name}.svg`"
    :class="{ white, animated, small }"
  />
</template>

<script>
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

  &.small {
    width: 16px;
    height: 16px;
  }

  &.animated {
    animation: spin 500ms linear infinite;
    transform:rotate(360deg);
  }
}
</style>
