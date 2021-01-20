<template lang="html">
  <header :class="{ 'has-action': hasSlot}">
    <div>
      <h5 class="mb-0 text-wrap">{{ title }}</h5>
      <small class="d-block text-muted">{{ subtitle }}</small>
    </div>

    <div class="actions" v-if="hasSlot">
      <slot />
    </div>

    <b-button
      :variant="nightMode ? 'dark' : 'light'"
      class="align-self-baseline"
      @click="$emit('close')"
    >
      <i class="fas fa-times fa-fw" aria-hidden />
    </b-button>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    title: String,
    subtitle: String,
  },

  computed: {
    ...mapGetters(['nightMode']),

    hasSlot() {
      return Object.keys(this.$slots).length > 0;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
header {
  display: grid;
  width: 100%;
  align-items: center;
  grid-template-columns: auto 46px;
  grid-gap: .5rem;

  &.has-action {
    grid-template-columns: 1fr auto 46px;
  }
}

h5 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  margin-left: auto;
  align-self: flex-start;
}
</style>
