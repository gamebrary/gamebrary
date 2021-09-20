<template lang="html">
  <div>
    <strong v-if="gameName">
      {{ gameName }} ({{ note.length }})
    </strong>

    <vue-markdown :source="note.note" />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown,
  },

  props: {
    note: Object,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
