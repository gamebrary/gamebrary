<template lang="html">
  <b-container fluid class="p-2">
    <portal to="header">
      <page-title
        title="Boards"
        action-text="Create board"
        @action="$router.push({ name: 'create-board' })"
      />
    </portal>


    <div v-if="boards.length">
      Boards

      <b-button @click="$router.push({ name: 'create-board' })">Create board</b-button>

      <boards class="mb-3" />
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
import Boards from '@/components/Boards';
import { mapState } from 'vuex';

export default {
  components: {
    Boards,
    EmptyState,
  },

  computed: {
    ...mapState(['user', 'boards']),
  },
};
</script>
