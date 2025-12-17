<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3>Gamebrary</h3>
    </portal>

    <div class="container">
      <div class="alert alert-success" role="alert" v-if="!user">
        <h4 class="alert-heading">Welcome!</h4>

        <p class="mb-0">
          Use Gamebrary to organize your video game collection.
        </p>

        <small class="text-info"><ins>Free</ins> and <a href="https://github.com/romancm/gamebrary/"
            target="_blank">Open Source</a></small>
      </div>

      <div class="mt-auto bg-light py-5">
        <h2 class="text-center text-primary mb-2">Game data from the most reliable sources</h2>

        <div class="d-flex align-items-start justify-content-center overflow-auto">
          <img src="/logos/data-sources/wikipedia.svg" alt="wikipedia" width="80" class="mx-3">
          <img src="/logos/data-sources/igdb.svg" alt="igdb" width="100" class="mx-3">
          <img src="/logos/data-sources/fandom.svg" alt="fandom" width="100" class="mx-3 mt-2">
          <img src="/logos/data-sources/amazon.svg" alt="amazon" width="100" class="mx-3 mt-3">
          <img src="/logos/data-sources/twitch.svg" alt="twitch" width="100" class="mx-3 mt-2">
          <img src="/logos/data-sources/speedrun.png" alt="speedrun" width="100" class="mx-3 mt-3">
          <img src="/logos/data-sources/gog.svg" alt="gog" width="70" class="mx-3">
          <img src="/logos/data-sources/steam.svg" alt="steam" width="80" class="mx-3">
        </div>
      </div>

      <game-boards />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import GameBoards from '@/components/GameBoards';
import TwitterFeed from '@/components/TwitterFeed';

const userStore = useUserStore();

const user = computed(() => userStore.user);
</script>
