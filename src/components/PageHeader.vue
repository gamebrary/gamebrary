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
        variant="link"
        :title="$t('navMenu.tags')"
        :to="{ name: 'tags' }"
        v-b-tooltip.hover.right
      >
        <icon name="tag" />
      </b-button>

      <b-button
        variant="link"
        :title="$t('navMenu.notes')"
        :to="{ name: 'notes' }"
        v-b-tooltip.hover.right
      >
        <icon name="note" />
      </b-button>

      <b-button
        variant="link"
        title="Settings"
        :to="{ name: 'settings' }"
        v-b-tooltip.hover.right
      >
        <icon name="gear" />
      </b-button>

      <hr class="m-0">

      <b-button
        variant="link"
        title="Settings"
        :to="{ name: 'settings' }"
        v-b-tooltip.hover.right
      >
        <icon name="gear" />
      </b-button>

      <board-switcher />

      <!-- <b-button
        :title="$t('navMenu.upgrade')"
        :to="{ name: 'upgrade' }"
        variant="link"
        v-b-tooltip.hover.right
      >
        <icon name="star-fill" />
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
