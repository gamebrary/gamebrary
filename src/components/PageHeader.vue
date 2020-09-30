<template lang="html">
  <nav
    class="position-fixed d-flex flex-column p-0 vh-100 text-center border-right border-light"
  >
    <router-link :to="{ name: 'dashboard' }" class="mt-2 mb-3">
      <!-- TODO: use svg, change color based on theme -->
      <img :src="logoUrl" width="32" />
    </router-link>

    <template v-if="showBoardsDropdown">
      <b-dropdown
        dropright
        right
        no-caret
        boundary="viewport"
        variant="link"
      >
        <template v-slot:button-content>
          <b-icon-arrow-left-right />
        </template>

        <b-dropdown-item
          :to="`/board/${id}`"
          :key="id"
          v-for="{ name, id } in sortedBoards"
          :active="board.id === id"
        >
          {{ name }}
        </b-dropdown-item>
      </b-dropdown>
    </template>

    <b-button
      v-else-if="showBoardTitle"
      class="p-0 px-1"
      variant="transparent"
    >
      {{ board.name }}
    </b-button>

    <div class="mt-auto">
      <b-dropdown
        dropright
        right
        no-caret
        boundary="viewport"
        variant="link"
      >
        <template v-slot:button-content>
          <b-icon-gear />
        </template>

        <b-dropdown-item title="Tags" :to="{ name: 'tags' }">
          <b-icon-tags />
          Tags
        </b-dropdown-item>

        <b-dropdown-item title="Wallpapers" :to="{ name: 'wallpapers' }">
          <b-icon-file-richtext />
          Wallpapers
        </b-dropdown-item>

        <b-dropdown-item title="Language" :to="{ name: 'language' }">
          <b-icon-chat-left-text />
          Language
        </b-dropdown-item>
        <b-dropdown-item title="Themes" :to="{ name: 'themes' }">
          <b-icon-droplet />
          Themes
        </b-dropdown-item>
        <b-dropdown-item title="Releases" :to="{ name: 'releases' }">
          <b-icon-mailbox />
          Releases
        </b-dropdown-item>

        <b-dropdown-item title="About" :to="{ name: 'about' }">
          <b-icon-question />
          About
        </b-dropdown-item>
      </b-dropdown>

      <router-link title="Account" :to="{ name: 'account' } "class="mb-2 mt-3 d-block">
        <b-avatar
          v-if="user && user.photoURL"
          variant="info"
          small
          :badge="notification"
          badge-variant="danger"
          :src="user.photoURL"
        />
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'user', 'notification', 'settings']),
    ...mapGetters(['sortedBoards']),

    logoUrl() {
      const { settings } = this;

      // TODO: use optional chaining
      const isDark = !settings.theme || (settings.theme && settings.theme.dark);

      return `/static/gamebrary-logo${isDark ? '' : '-dark'}.png`;
    },

    routeName() {
      return this.$route.name;
    },

    showBoardTitle() {
      return this.$route.name === 'board' && this.board.name;
    },

    showBoardsDropdown() {
      return this.showBoardTitle && this.sortedBoards.length > 1;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  width: 50px;
  z-index: 1;
}
</style>
