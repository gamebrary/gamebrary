<template lang="html">
  <b-img
    class="clickable rounded align-self-end card overflow-hidden border-0"
    :src="coverUrl"
  />
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],
};
</script>
