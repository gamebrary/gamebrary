<template lang="html">
  <div class="text-center m-auto align-content-center h-75">
    <h1 v-if="title">{{ title }}</h1>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    illustration: String,
    actionText: String,
    busy: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
