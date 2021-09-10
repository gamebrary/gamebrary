<template lang="html">
  <header class="my-4 d-flex align-items-center justify-content-between">
    <h3>{{ title }}</h3>

    <b-button
      v-if="actionText"
      variant="primary"
      @click="$emit('action')"
    >
      {{ actionText }}
    </b-button>
  </header>
</template>

<script>
export default {
  props: {
    title: String,
    actionText: String,
  },
};
</script>
