<template lang="html">
  <div class="d-flex align-items-center justify-content-between p-3">
    {{ title }}
    <slot />

    <b-button
      @click="$emit('hide')"
      :variant="darkTheme ? 'black' : 'white'"
    >
      <i class="fa-solid fa-xmark" />
    </b-button>
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
