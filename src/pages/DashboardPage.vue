<template lang="html">
  <b-container>
    <portal to="headerActions">
      <b-button
        variant="light"
        class="mr-2"
        :to="{ name: 'create.board' }"
      >
        Create board
      </b-button>
    </portal>

    <game-boards class="mb-3" />
  </b-container>
</template>

<script>
import GameBoards from '@/components/GameBoards';

export default {
  components: {
    GameBoards,
  },
};
</script>
