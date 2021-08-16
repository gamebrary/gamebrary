<template lang="html">
  <div>
    <page-title
      title="Boards"
      action-text="Create board"
      @action="$bvModal.show('create-board')"
    />

    <boards />

    <empty-state
      title="Boards"
      message="Use boards to easily organize your video game collections"
    >
      <b-button v-b-modal:create-board variant="info">
        {{ $t('boards.create') }}
      </b-button>

      <b-button :to="{ name: 'home' }">
        Explore boards
      </b-button>
    </empty-state>
  </div>
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
    ...mapState(['user']),
  },
};
</script>
