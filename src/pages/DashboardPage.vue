<template lang="html">
  <b-container fluid class="p-2">
    <portal to="header">
      <page-title
        title="Boards"
        action-text="Create board"
        @action="$router.push({ name: 'create-board' })"
      />
    </portal>

    <portal to="headerActions">
      <b-button
        variant="primary"
        class="mr-2"
        @click="$router.push({ name: 'create-board' })"
      >
        Create board
      </b-button>
    </portal>

    <div v-if="boards.length">
      <game-boards class="mb-3" />
    </div>

    <empty-state
      v-else
      title="Boards"
      message="Use boards to easily organize your video game collections"
    >
      <b-button v-b-modal:create-board variant="info">
        {{ $t('boards.create') }}
      </b-button>

      <b-button :to="{ name: 'explore' }">
        Explore boards
      </b-button>
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
