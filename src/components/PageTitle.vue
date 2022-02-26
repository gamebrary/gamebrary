<template lang="html">
  <header class="my-3 d-flex align-items-center justify-content-between">
    <h5 class="m-0">{{ title }}</h5>

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
