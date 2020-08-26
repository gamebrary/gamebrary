<template lang="html">
  <div class="gameboard-placeholder">
    <div
      v-for="list in placeholderBoard.lists"
      :class="`list ${list.settings.view || 'single'}`"
      :key="list.name"
    >
    <b-card no-body>
      <b-card-header class="py-1 px-2">
        <placeholder class="header" />
      </b-card-header>

      <div :class="['games', list.settings.view]" v-if="list.games.length">
        <placeholder
          class="game"
          v-for="n in list.games.length"
          :lines="list && list.settings.view === 'grid' ? 0 : 2"
          :key="n"
          :image="list.settings.view !== 'text'"
        />
      </div>

      <b-button
        v-else
        variant="light"
        block
        class="mb-2"
        disabled
      >
        Click here or drag games here
      </b-button>
    </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    Placeholder,
  },

  data() {
    return {
      placeholderBoard: {},
    };
  },

  computed: {
    ...mapState(['boards', 'board']),
  },

  mounted() {
    const boardId = this.$route.params.id;

    this.placeholderBoard = Object.keys(this.board).length > 0
      ? this.board
      : this.boards.find(({ id }) => id === boardId);
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "~styles/styles";

  .gameboard-placeholder {
    user-select: none;
    display: flex;
    align-items: flex-start;
  }

  .list {
    flex-shrink: 0;
    cursor: default;
    border-radius: var(--border-radius);
    background: var(--list-background);
    overflow: hidden;
    position: relative;
    width: 300px;
    margin-right: 1rem;
    max-height: calc(100vh - 81px);
  }

  .header {
    margin: 6px 0;
  }

  .games {
    display: grid;
    grid-gap: .5rem ;
    padding: .5rem;

    &.single {
      --placeholder-text-margin: .5rem .5rem 0 0;
      border-radius: var(--border-radius);
    }

    &.grid {
      --placeholder-image-width: 140px;
      --placeholder-image-height: 200px;
      padding-top: .5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: .25rem;
    }

    &.compact {
      --placeholder-image-width: 50px;
      --placeholder-image-height: 80px;
      --placeholder-text-margin: .5rem .5rem 0 0;
    }

    &.text {
      --placeholder-text-margin: .5rem;
    }
  }

  .game {
    background: var(--game-card-background);
    border-radius: var(--border-radius);
    overflow: hidden;
  }
</style>
