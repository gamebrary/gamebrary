<template>
  <b-dropdown v-if="user" v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }" title="Games"
    :variant="isGamePage || $route.name === 'games' ? darkTheme ? 'outline-success' : 'outline-dark' : null"
    :toggle-class="isGamePage ? 'px-2 py-0' : null" v-bind="dockDropdownProps">
    <template #button-content>
      <!-- TODO: fix this -->
      <div class="d-flex align-items-center">
        <b-img v-if="isGamePage && !isVerticalNav" :src="$options.getImageUrl(game)" :alt="game.name" height="32"
          style="border-radius: 3px;" />

        <i v-else class="fa-solid fa-gamepad fa-fw" />

        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          <span class="ml-2">{{ gameButtonTitle }}</span>
        </span>
      </div>
    </template>


    <b-dropdown-group v-if="isGamePage" class="p-1 bg-light m-1 rounded">
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

    <b-dropdown-item :to="{ name: 'search' }">
      <i class="fa fa-search fa-fw" aria-hidden="true" />
      Find games
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

    gameButtonTitle() {
      if (this.isGamePage) return this.game.name;

      return 'Games';
    }
  },
};
</script>

<style scoped></style>