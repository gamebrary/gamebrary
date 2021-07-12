<template lang="html">
  <header>
    <portal to="pageTitle">{{ title }}</portal>

    <portal to="dock">
      <div class="d-flex align-items-center justify-content-between">
        <slot />

        <b-button
          v-if="actionText"
          variant="primary"
          @click="$emit('action')"
        >
          {{ actionText }}
        </b-button>
      </div>
    </portal>
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
