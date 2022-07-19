<template lang="html">
  <b-card
    body-class="settings-card"
    class="cursor-pointer mb-3"
  >
    <i :class="`fa-2x fa-solid ${icon} fa-fw`" aria-hidden />

    <aside>
      <h4 class="mb-0 strong">{{ title }}</h4>
      <small class="text-muted">{{ description }}</small>
    </aside>
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
  max-width: 100%;
  width: 400px;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto 1fr;
}
</style>
