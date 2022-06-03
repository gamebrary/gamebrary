<template lang="html">
  <b-container fluid>
    <portal to="headerActions">
      <b-button
        variant="primary"
        class="mr-2"
        @click="$router.push({ name: 'create.board' })"
      >
        Create board
      </b-button>
    </portal>

    <game-boards v-if="boards.length" class="mb-3" />

    <empty-state
      v-else
      title="Boards"
      message="Use boards to easily organize your video game collections"
    >
      <b-button :to="{ name: 'create.board' }" variant="info">
        {{ $t('boards.create') }}
      </b-button>

      <!-- TODO: enable once public boards are ready -->
      <!-- <b-button :to="{ name: 'explore' }">
        Explore boards
      </b-button> -->
    </empty-state>
  </b-container>
</template>

<script>
import EmptyState from '@/components/EmptyState';
import GameBoards from '@/components/GameBoards';
import { mapState } from 'vuex';

export default {
  components: {
    GameBoards,
    EmptyState,
  },

  computed: {
    ...mapState(['user', 'boards']),
  },
};
</script>
