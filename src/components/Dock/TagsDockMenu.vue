<template>
  <b-button
    block
    :variant="darkTheme ? 'dark' : 'light'"
    :to="{ name: 'tags' }"
  >
    <i class="fa-light fa-tags fa-fw" />
    <span class="ml-2">Tags</span>
  </b-button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['darkTheme']),
  },
}
</script>

<style scoped>
/* Your component's styles here */
</style>
