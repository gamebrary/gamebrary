<template lang="html">
  <header :class="{ 'has-action': slots.includes('default') }">
    <div>
      <slot name="header" v-if="slots.includes('header')" />
      <h3 class="text-wrap">{{ title }}</h3>
      <small class="d-block text-muted" style="margin-top: -4px;">{{ subtitle }}</small>
    </div>

    <div class="actions" v-if="slots.includes('default')">
      <slot />
    </div>

    <b-button
      class="align-self-baseline"
      :variant="darkTheme ? 'dark' : 'light'"
      @click="$emit('close')"
    >
      <i class="fas fa-close" aria-hidden />
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
    ...mapGetters(['darkTheme']),

    slots() {
      return Object.keys(this.$slots);
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
