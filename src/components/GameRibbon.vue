<template>
  <span v-if="gameCategory" :class="['ribbon text-dark small', backgroundClass]">
    {{ gameCategory }}
  </span>
</template>

<script>
import { GAME_CATEGORIES } from '@/constants';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  computed: {
    gameCategory() {
      return GAME_CATEGORIES?.[this.game?.category];
    },

    backgroundClass() {
      const id = this.game?.category;

      if (id === 1) return 'bg-primary text-white'; // 'DLC/Add-on'
      if (id === 2) return 'bg-info'; // 'Expansion'
      if (id === 3) return 'bg-secondary text-white'; // 'Bundle'
      if (id === 4) return 'bg-info'; // 'Expansion'
      if (id === 5) return 'bg-danger text-white'; // 'Mod'
      if (id === 6) return 'bg-info'; // 'Episode'
      if (id === 7) return 'bg-info'; // 'Season'
      if (id === 8) return 'bg-success'; // 'Remake'
      if (id === 9) return 'bg-black text-white'; // 'Remaster'
      if (id === 10) return 'bg-success'; // 'Expansion'
      if (id === 11) return 'bg-info text-danger'; // 'Port'
      if (id === 12) return 'bg-danger'; // 'Fork'
      if (id === 13) return 'bg-secondary'; // 'Pack/DLC'
      if (id === 14) return 'bg-dark'; // 'Update'

      return 'bg-danger';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.ribbon {
  $fold: 6px;
  $offset: 8px;

  position: absolute;
  inset: $offset calc(-1 * $fold) auto auto;
  padding: 0 $offset $fold $offset;
  clip-path:
    polygon(0 0,100% 0,100% calc(100% - $fold),calc(100% - $fold) 100%, calc(100% - $fold) calc(100% - $fold),0 calc(100% - $fold), 0 calc(50% - $fold / 2));
  box-shadow: 0 calc(-1 * $fold) 0 inset var(--dark);
}
</style>
