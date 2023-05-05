<template lang="html">
  <div class="text-center pt-5 ml-auto mr-auto">
    <b-img
      v-if="illustration"
      :src="`/illustrations/${illustration}.png`"
      class="mb-4"
      height="140"
    >

    </b-img>
    <h2 v-if="title">{{ title }}</h2>
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
