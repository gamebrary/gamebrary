<!-- TODO: only make transparent when x-scrolled -->
<template lang="html">
  <nav
    class="rounded position-fixed d-flex flex-column p-0 m-2 text-center"
    :class="{ 'bg-dark text-white': nightMode, 'border': !nightMode }"
  >
    <router-link
      :to="{ name: 'dashboard' }"
      title="Boards"
      class="my-2"
      v-b-tooltip.hover.right
    >
      <img
        :src="`/static/gamebrary-logo${nightMode ? '' : '-dark'}.png`"
        width="32"
      />
    </router-link>

    <div class="mt-auto">
      <b-button
        variant="transparent"
        :class="nightMode ? 'text-white' : 'text-dark'"
        :title="$t('navMenu.tags')"
        :to="{ name: 'tags' }"
        v-b-tooltip.hover.right
      >
        <i class="fas fa-tags fa-fw"></i>
      </b-button>

      <b-button
        variant="transparent"
        :class="nightMode ? 'text-white' : 'text-dark'"
        :title="$t('navMenu.notes')"
        :to="{ name: 'notes' }"
        v-b-tooltip.hover.right
      >
        <i class="far fa-sticky-note fa-fw"></i>
      </b-button>

      <b-button
        variant="transparent"
        :class="nightMode ? 'text-white' : 'text-dark'"
        title="Settings"
        :to="{ name: 'settings' }"
        v-b-tooltip.hover.right
      >
        <i class="fas fa-cog"></i>
      </b-button>

      <hr class="m-0">

      <board-switcher />

      <!-- <b-button
        :title="$t('navMenu.upgrade')"
        :to="{ name: 'upgrade' }"
        variant="transparent"
        :class="nightMode ? 'text-white' : 'text-dark'"
        v-b-tooltip.hover.right
      >
        <i class="fas fa-star" aria-hidden></i>
      </b-button> -->
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BoardSwitcher from '@/components/Board/BoardSwitcher';

export default {
  components: {
    BoardSwitcher,
  },

  computed: {
    ...mapState(['board', 'notification', 'settings']),
    ...mapGetters(['nightMode']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  width: 50px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);

  &:hover {
    background: white;
  }
}
</style>
