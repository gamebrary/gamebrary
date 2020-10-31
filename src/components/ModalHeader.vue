<template lang="html">
  <header>
    <div>
      <h5 class="mb-0">{{ title }}</h5>
      <small>{{ subtitle }}</small>
    </div>

    <div class="actions">
      <slot />

      <b-button
        :variant="nightMode ? 'dark' : 'light'"
        size="sm"
        class="ml-auto"
        @click="$emit('close')"
      >
        <icon name="x" />
      </b-button>
    </div>
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
header {
  display: grid;
  width: 100%;
  align-items: center;
  grid-template-columns: auto auto;
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
