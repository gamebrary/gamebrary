<template lang="html">
  <b-card
    body-class="settings-card field"
    class="cursor-pointer mb-3"
  >
    <i v-if="icon" :class="`fa-2x fa-solid ${icon} fa-fw`" aria-hidden />

    <aside v-if="title || description">
      <h4 class="mb-0 strong">{{ title }}</h4>
      <small class="text-muted">{{ description }}</small>
    </aside>

    <slot />
  </b-card>
</template>

<script>
export default {
  props: {
    title: String,
    to: Object,
    icon: String,
    description: String,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.settings-card {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto 1fr;
}
</style>
