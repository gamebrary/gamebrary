<template lang="html">
  <div
    v-if="image || lines"
    :class="['placeholder', { 'has-image': image && lines > 0 }]"
  >
    <div v-if="image" class="image" />

    <div v-if="lines" class="text">
      <div
        v-for="n in lines"
        :key="n"
        class="text-line"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    lines: {
      type: Number,
      default: null,
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.placeholder {
  max-width: 100%;

  &.has-image {
    display: grid;
    grid-template-columns: var(--placeholder-image-width, 80px) auto;
    grid-gap: $gp;
  }
}

// Animation
@keyframes placeholder{
  0%{
    background-position: -468px 0
  }
  100%{
    background-position: 468px 0
  }
}

.animated-background {
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeholder;
  animation-timing-function: linear;
  background: var(--placeholder-background, #e5e5e5);
  background: linear-gradient(to right,
    var(--placeholder-background, #e5e5e5) 8%,
    var(--placeholder-accent, #fff) 18%,
    var(--placeholder-background, #e5e5e5) 33%);
  background-size: 800px 104px;
  height: 96px;
  position: relative;
}

.image {
  width: var(--placeholder-image-width, 80px);
  height: var(--placeholder-image-height, 120px);
  @extend .animated-background;
  border-radius: $border-radius / 2;
}

.text {
  margin: var(--placeholder-text-margin, 0);
}

.text-line {
  width: var(--placeholder-text-width, 100%);
  height: var(--placeholder-text-height, 12px);
  margin-bottom: $gp / 2;
  border-radius: $border-radius / 2;
  @extend .animated-background;
}
</style>
