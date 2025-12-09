<template>
  <div class="position-relative">
    <button
      type="button"
      class="btn ms-3 mt-2 p-0 position-absolute"
      :class="darkTheme ? 'btn-dark' : 'btn-light'"
      style="background: transparent; border: none;"
      :disabled="!user"
      @click="$bus.$emit('LIKE_UNLIKE_GAME', gameId)"
    >
      <i :class="[isLiked ? 'fa-solid': 'fa-regular' , 'fa-heart text-danger']" />
    </button>

    <GameRatings class="position-absolute d-flex" style="bottom: 1rem; right: 1rem;" />

    <GameMediaCarousel />

    <img
      :src="$options.getImageUrl(game)"
      :alt="gameName"
      class="cursor-pointer border d-flex mb-3 w-100 rounded"
      :class="`border-${darkTheme ? 'dark' : 'light'}`"
      @click="openMediaModal"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameRatings from '@/components/Game/GameRatings';
import GameMediaCarousel from '@/components/Game/GameMediaCarousel';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameRatings,
    GameMediaCarousel,
  },

  computed: {
    ...mapState(['game', 'cachedGames', 'games', 'user']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks', 'gameGenres']),

    gameId() {
      return this.$route.params.id;
    },

    isLiked() {
      return this.games?.[this.gameId];
    },

    cachedGame() {
      return this.cachedGames?.[Number(this.$route.params.id)] || this.game;
    },

    gameName() {
      return this.cachedGame?.name;
    },
  },

  methods: {
    openMediaModal() {
      const modalElement = document.getElementById('mediaModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },
  },
}
</script>
