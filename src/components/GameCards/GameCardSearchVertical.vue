<template lang="html">
  <b-card
    no-body
    :title="game.name"
    :img-src="coverUrl"
    :img-alt="game.name"
    img-top
    class="mb-2"
    footer-class="p-0 text-center font-weight-bold bold strong"
    @click="addGameToList"
  >
  <!-- :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" -->

    <template #footer>
      <small class="text-muted">
        <strong>{{ game.name }}</strong>
      </small>
    </template>
  </b-card>
</template>

<script>
import { getGameCoverUrl } from '@/utils';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    coverUrl() {
      return getGameCoverUrl(this.game);
    }
  },

  methods: {
    addGameToList() {
      this.$bus.$emit('ADD_GAME', this.game.id);
    },
  },
};
</script>
