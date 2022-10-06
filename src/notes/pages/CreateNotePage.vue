<!-- TODO: finish -->
<template lang="html">
  <b-container>
    Create note

    <game-note
      v-if="note"
      :note="{ note }"
      class="mt-3 mt-sm-0"
    />

    <b-form-textarea
      v-model.trim="note"
      placeholder="Type note here"
      rows="3"
      max-rows="20"
    />
  </b-container>
</template>

<script>
import GameNote from '@/components/GameNote';

export default {
  data() {
    return {
      note: '',
    }
  },

  components: {
    GameNote,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
