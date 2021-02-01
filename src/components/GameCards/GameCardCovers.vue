<template lang="html">
  <b-img
    class="clickable rounded"
    :src="coverUrl"
  />
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],
};
</script>
