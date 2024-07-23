<template>
  <div>  
    <div v-if="isGamePage" class="p-1 bg-light m-1 rounded">
      <b-img
        v-if="isGamePage && gameName"
        :src="$options.getImageUrl(game)"
        width="140"
        rounded
        :alt="gameName"
      />

      <strong>{{ gameName }}</strong>

      <b-button @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
        Add note
      </b-button>
      <b-button v-b-modal.gameTagsModal>Edit tags</b-button>
      <b-button v-b-modal.addRemoveGameModal>Add to list</b-button>
    </div>

    <b-button
      :variant="darkTheme ? 'dark' : 'light'"
      :to="{ name: 'games' }"
      block
    >
    <i class="fa-regular fa-gamepad fa-fw" />
      My games
    </b-button>

    <!-- TODO: Add progresses page -->
    <b-button
      :variant="darkTheme ? 'dark' : 'light'"
      block
      :to="{ name: 'home' }"
      disabled
    >
      <i
        class="fa-solid fa-stopwatch fa-fw"
        aria-hidden="true"
      />
      <span class="ml-2">Progresses</span>
    </b-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  data() {
    return {

    };
  },

  computed: {
    ...mapState(['user', 'tags', 'game']),
    ...mapGetters(['dockButtonProps', 'darkTheme']),

    isGamePage() {
      return ['game.notes','game','game.news'].includes(this.$route.name);
    },

    gameName() {
      return this.game?.name;
    },

    gameButtonTitle() {
      if (this.isGamePage) return this.game?.name;

      return 'Games';
    }
  },
};
</script>

<style scoped></style>