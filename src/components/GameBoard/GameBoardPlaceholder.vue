<template lang="html">
  <div class="gameboard-placeholder">
    <div
      v-for="list in lists"
      :class="`list ${list.view || 'single'}`"
      :key="list.name"
    >
      <div class="list-header" />

      <div :class="['games', list.view]">
        <placeholder
          class="game"
          v-for="n in list.games.length"
          :lines="list && list.view === 'grid' ? 0 : 2"
          :key="n"
          :image="list.view !== 'text'"
        />
      </div>
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
  @import "~styles/styles";

  .gameboard-placeholder {
    user-select: none;
    display: flex;
    align-items: flex-start;
  }

  .list {
    flex-shrink: 0;
    cursor: default;
    border-radius: $border-radius;
    background: var(--list-background);
    overflow: hidden;
    position: relative;
    width: $list-width;
    margin-right: $gp;
    max-height: calc(100vh - 81px);
  }

  .list-header {
    background: var(--list-header-background);
    height: $list-header-height;
    position: absolute;
    width: 100%;
  }

  .games {
    margin-top: $list-header-height;
    display: grid;
    grid-gap: $gp / 2 ;
    padding: $gp / 2;

    &.single {
      --placeholder-text-margin: #{$gp / 2} #{$gp / 2} 0 0;
      border-radius: $border-radius;
    }

    &.masonry {
      --placeholder-image-width: 100px;
      padding-top: $gp / 2;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: $gp / 4;
    }

    &.grid {
      --placeholder-image-width: 140px;
      --placeholder-image-height: 200px;
      padding-top: $gp / 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: $gp / 4;
    }

    &.wide {
      --placeholder-image-width: 50px;
      --placeholder-image-height: 80px;
      --placeholder-text-margin: #{$gp / 2} #{$gp / 2} 0 0;
    }

    &.text {
      --placeholder-text-margin: #{$gp / 2};
    }
  }

  .game {
    background: var(--game-card-background);
    border-radius: $border-radius;
    overflow: hidden;
  }
</style>
