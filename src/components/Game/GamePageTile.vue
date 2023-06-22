<template>
  <div :class="full ? 'full-tile w-100' : 'half-tile'">
    <section :class="['p-3 rounded my-3 m-3', darkTheme ? 'bg-dark text-light' : 'bg-light']">
      <h3>{{ title }}</h3>

      <div :class="['rounded', { 'half-height-scrollable': !full }]">
        <slot />
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    title: String,
    full: Boolean,
  },

  computed: {
    ...mapGetters(['darkTheme']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.half-tile {
  width: 50vw;
  height: 50vh;
  overflow: hidden !important;

  @media(max-width: 768px) {
    width: auto;
    overflow: auto !important;
  }
}

.full-tile {
  width: 100vw;
  overflow: auto !important;
}

.half-height-scrollable {
  height: calc(50vh - 94px);
  overflow: auto;
}
</style>
