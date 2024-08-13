<template lang="html">
  <div>
    <GameCard game-id="222095" />
    <GameCard game-id="222095" small/>
    <GameCard game-id="222095" small hide-tags />
    <GameCard game-id="222095" vertical />
    <GameCard game-id="222095" vertical small />
    <GameCard game-id="1022" />
    <GameCard game-id="1027" hide-cover />
    <GameCard game-id="1027" />
    <GameCard game-id="1105" />
  </div>
</template>

<script>
import GameCard from '@/components/GameCard';

export default {
  components: {
    GameCard,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
