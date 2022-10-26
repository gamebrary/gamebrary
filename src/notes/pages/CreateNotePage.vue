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
      class="mb-3"
      max-rows="20"
    />

    <game-selector />
  </b-container>
</template>

<script>
import GameNote from '@/components/GameNote';
import GameSelector from '@/components/GameSelector';

export default {
  data() {
    return {
      note: '',
    }
  },

  components: {
    GameNote,
    GameSelector,
  },
};
</script>
