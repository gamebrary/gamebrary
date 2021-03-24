<template lang="html">
  <b-img
    class="clickable rounded align-self-end card overflow-hidden border-0"
    :src="coverUrl"
  />
</template>

<script>
import GameCardMixin from '@/mixins/GameCardMixin';

export default {
  mixins: [GameCardMixin],
};
</script>
