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
      :src="getImageUrl(cachedGame)"
      :alt="gameName"
      class="cursor-pointer border d-flex mb-3 w-100 rounded"
      :class="`border-${darkTheme ? 'dark' : 'light'}`"
      @click="openMediaModal"
    />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import GameRatings from '@/components/Game/GameRatings';
import GameMediaCarousel from '@/components/Game/GameMediaCarousel';
import { getImageUrl } from '@/utils';

const route = useRoute();
const store = useStore();
const $bus = inject('$bus');

// Store state and getters
const game = computed(() => store.state.game);
const cachedGames = computed(() => store.state.cachedGames);
const games = computed(() => store.state.games);
const user = computed(() => store.state.user);
const darkTheme = computed(() => store.getters.darkTheme);
const gameNews = computed(() => store.getters.gameNews);
const gameLinks = computed(() => store.getters.gameLinks);
const gameGenres = computed(() => store.getters.gameGenres);

// Computed properties
const gameId = computed(() => route.params.id);

const isLiked = computed(() => {
  return games.value?.[gameId.value];
});

const cachedGame = computed(() => {
  return cachedGames.value?.[Number(route.params.id)] || game.value;
});

const gameName = computed(() => {
  return cachedGame.value?.name;
});

// Methods
const openMediaModal = () => {
  const modalElement = document.getElementById('mediaModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
};
</script>
