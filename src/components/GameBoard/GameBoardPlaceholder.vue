<template lang="html">
  <div class="gameboard-placeholder">
    <div
      v-for="list in lists"
      :class="`list ${list.view || 'single'}`"
      :key="list.name"
    >
      <div class="list-header" />

      <div class="games">
        <placeholder
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

    &.wide {
      --placeholder-image-width: 80px;
      --placeholder-image-height: 80px;
    }

    &.masonry {
      --placeholder-image-width: 90px;
    }

    &.masonry .games {
      padding-top: $gp / 2;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: $gp / 4;

      .placeholder {
        margin: 0;
        padding: 0;
      }
    }

    &.grid {
      --placeholder-image-width: 140px;
      --placeholder-image-height: 220px;
    }

    &.grid .games {
      padding-top: $gp / 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: $gp / 4;

      .placeholder {
        margin: 0;
        padding: 0;
      }
    }
  }

  .list-header {
    background: var(--list-header-background);
    height: $list-header-height;
    position: absolute;
    width: 100%;
  }

  .placeholder {
    background: var(--game-card-background);
    padding: $gp / 2;
  }

  .games {
    margin-top: $list-header-height;
    display: grid;
    grid-gap: $gp / 2 ;
    width: 100%;
    padding: $gp / 2;
  }
</style>
