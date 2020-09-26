<template lang="html">
  <nav
    class="position-fixed d-flex flex-column p-0 vh-100 text-center border-right border-light"
  >
    <router-link :to="{ name: 'home' }" class="mt-2">
      <!-- TODO: use svg, change color based on theme -->
      <img :src="logoUrl" width="32" />
    </router-link>

    <b-dropdown
      v-if="showBoardsDropdown"
      variant="transparent"
      toggle-class="p-0 px-1"
      :text="board.name"
    >
      <b-dropdown-item
        :to="`/board/${id}`"
        :key="id"
        variant="outline-primary"
        v-for="{ name, id } in sortedBoards"
        :active="board.id === id"
      >
        <b-icon-arrow-left-right />
      </b-dropdown-item>
    </b-dropdown>

    <!-- <b-button
      v-else-if="showBoardTitle"
      class="p-0 px-1"
      variant="transparent"
    >
      {{ board.name }}
    </b-button> -->

    <router-link
      title="Tags"
      v-b-tooltip.hover.right
      :to="{ name: 'tags' }"
      class="py-2 mt-1"
    >
      <b-icon-tags :variant="routeName === 'tags' ? 'primary' : 'secondary'" />
    </router-link>

    <router-link
      title="Wallpapers"
      v-b-tooltip.hover.right
      class="py-2 mt-1"
      :to="{ name: 'wallpapers' }"
    >
      <b-icon-file-richtext :variant="routeName === 'wallpapers' ? 'primary' : 'secondary'" />
    </router-link>

    <router-link
      title="Language"
      v-b-tooltip.hover.right
      :to="{ name: 'language' }"
      class="py-2 mt-1"
    >
      <b-icon-chat-left-text :variant="routeName === 'language' ? 'primary' : 'secondary'" />
    </router-link>
    <router-link
      title="Themes"
      v-b-tooltip.hover.right
      :to="{ name: 'themes' }"
      class="py-2 mt-1"
    >
      <b-icon-droplet :variant="routeName === 'themes' ? 'primary' : 'secondary'" />
    </router-link>
    <router-link
      title="Releases"
      v-b-tooltip.hover.right
      class="py-2 mt-1"
      :to="{ name: 'releases' }"
    >
      <b-icon-mailbox :variant="routeName === 'releases' ? 'primary' : 'secondary'" />
    </router-link>

    <router-link
      title="About"
      v-b-tooltip.hover.right
      class="py-2 mt-1"
      :to="{ name: 'about' }"
    >
      <b-icon-question :variant="routeName === 'about' ? 'primary' : 'secondary'"  />

      <!-- <span class="d-none d-sm-block">
        About
      </span> -->
    </router-link>

    <router-link
      class="mt-auto mb-2"
      title="Account"
      v-b-tooltip.hover.right
      :to="{ name: 'account' }"
    >
      <b-avatar
        v-if="user && user.photoURL"
        variant="info"
        small
        :badge="notification"
        badge-variant="danger"
        :src="user.photoURL"
      />
    </router-link>
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
      const isDark = settings && settings.theme && settings.theme.dark;

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
}
</style>
