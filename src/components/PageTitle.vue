<template lang="html">
  <header>
    <div class="d-none d-sm-flex align-items-center justify-content-between">
      <h1>{{ title }}</h1>

      <slot />

      <b-button
        v-if="actionText"
        variant="primary"
        class="d-none d-sm-block"
        @click="$emit('action')"
      >
        {{ actionText }}
      </b-button>
    </div>

    <portal to="dock">
      <div class="d-sm-none">
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

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
