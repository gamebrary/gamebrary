<template lang="html">
  <b-container fluid>
    <portal to="headerTitle">
      My Boards
    </portal>

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

    <empty-state
      v-if="boards.length === 0"
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

    <footer class="text-center">
      <b-button
        :to="{ name: 'releases' }"
        size="sm"
        variant="transparent"
      >
        {{ latestRelease }}
      </b-button>
    </footer>
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
    ...mapState(['user', 'boards', 'releases']),

    latestRelease() {
      const [{ tag_name }] = this.releases;

      return tag_name || '';
    },
  },
};
</script>
