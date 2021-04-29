<template lang="html">
  <header class="d-flex align-items-center justify-content-between">
    <h1 class="d-none d-sm-block">{{ title }}</h1>

    <slot />
    <b-button
      v-if="actionText"
      variant="primary"
      class="d-none d-sm-block"
      @click="$emit('action')"
    >
      {{ actionText }}
    </b-button>

    <portal to="dock">

      <div class="d-sm-none" v-if="actionText">
        <slot />

        <b-button
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
