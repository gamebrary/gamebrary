<template>
  <b-dropdown
    v-if="user"
    v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
    title="Games"
    v-bind="dockDropdownProps"
  >
    <template #button-content>
      <i class="fa-regular fa-game-console-handheld"></i>
    </template>

    <b-dropdown-group v-if="isGamePage" class="p-1 bg-light m-1 rounded">
      <b-img
        v-if="isGamePage && !isVerticalNav && gameName"
        :src="$options.getImageUrl(game)"
        width="140"
        rounded
        :alt="gameName"
      />

      <strong>{{ gameName }}</strong>

      <b-dropdown-item-button @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
        Add note
      </b-dropdown-item-button>
      <b-dropdown-item v-b-modal.gameTagsModal>Edit tags</b-dropdown-item>
      <b-dropdown-item v-b-modal.addRemoveGameModal>Add to list</b-dropdown-item>
    </b-dropdown-group>

    <b-dropdown-item :to="{ name: 'games' }">
      <i class="fa-solid fa-heart fa-fw" />
      <span class="ml-2">My games</span>
    </b-dropdown-item>

    <!-- TODO: Add progresses page -->
    <!-- <b-dropdown-item
    :to="{ name: 'home' }"
    disabled
    >
    <i
        class="fa-solid fa-stopwatch fa-fw"
        aria-hidden="true"
    />
    <span class="ml-2">Progresses</span>
    </b-dropdown-item> -->
  </b-dropdown>
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
    ...mapGetters(['isVerticalNav', 'dockDropdownProps', 'darkTheme']),

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