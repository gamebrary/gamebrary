<template lang="html">
  <header class="mb-2 d-flex align-items-center justify-content-between">
    <h1 class="m-0">{{ title }}</h1>

    <div v-if="$slots.default || actionText">
      <slot />

      <b-button
        v-if="actionText"
        variant="primary"
        @click="$emit('action')"
      >
        {{ actionText }}
      </b-button>
    </div>
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
