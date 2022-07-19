<template lang="html">
  <b-container fluid>
    <b-row>
      <search-box />
    </b-row>
    <header>
      My Boards

      <b-button
        variant="primary"
        class="mr-2"
        :to="{ name: 'create.board' }"
      >
        Create board
      </b-button>
    </header>

    <b-button
      variant="primary"
      class="mr-2"
      :to="{ name: 'notes.settings' }"
    >
      Notes
    </b-button>

    <b-button
      variant="primary"
      class="mr-2"
      :to="{ name: 'tags.settings' }"
    >
      Tags
    </b-button>

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
import SearchBox from '@/components/SearchBox';
import { mapState } from 'vuex';

export default {
  components: {
    SearchBox,
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
