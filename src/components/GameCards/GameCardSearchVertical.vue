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
import { mapState } from 'vuex';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState(['user']),

    coverUrl() {
      return getGameCoverUrl(this.game);
    }
  },

  methods: {
    addGameToList() {
      return this.user
        ? this.$bus.$emit('ADD_GAME', this.game.id)
        : this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug }});
    },
  },
};
</script>
