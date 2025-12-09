<template lang="html">
  <div class="d-flex align-items-center justify-content-between p-3">
    <h2 v-if="title">{{ title }}</h2>
    <slot />

    <button
      type="button"
      class="btn"
      :class="darkTheme ? 'btn-dark' : 'btn-light'"
      @click="$emit('hide')"
    >
      <i class="fa-solid fa-xmark" />
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['darkTheme']),
  },

  props: {
    title: String,
  }
}
</script>
