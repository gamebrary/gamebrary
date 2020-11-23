<template lang="html">
  <div class="text-center pt-5">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>

    <b-button
      v-if="actionText"
      variant="primary"
      @click="$emit('action')"
    >
      {{ actionText }}
    </b-button>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    actionText: String,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
