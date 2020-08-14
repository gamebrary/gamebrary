<template lang="html">
  <div class="gameboard-placeholder">
    <div
      v-for="list in lists"
      :class="`list ${list.view || 'single'}`"
      :key="list.name"
    >
    <b-card no-body>
      <b-card-header class="py-1 px-2">
        <div class="list-header" />
      </b-card-header>

      <div :class="['games', list.view]">
        <placeholder
          class="game"
          v-for="n in list.games.length"
          :lines="list && list.view === 'grid' ? 0 : 2"
          :key="n"
          :image="list.view !== 'text'"
        />
      </div>
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

  computed: {
    ...mapState(['gameLists', 'platform']),

    lists() {
      return this.gameLists && this.platform && this.gameLists[this.platform.code]
        ? this.gameLists[this.platform.code]
        : [];
    },
  },

  methods: {
    randomColumn() {
      return Math.floor(Math.random() * 4) + 1;
    },
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

  .list-header {
    background: var(--list-header-background);
    height: 32px;
    width: 100%;
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
