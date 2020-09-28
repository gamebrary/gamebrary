<template lang="html">
  <nav
    class="position-fixed d-flex flex-column p-0 vh-100 text-center border-right border-light"
  >
    <router-link :to="{ name: 'dashboard' }" class="mt-2 mb-3">
      <!-- TODO: use svg, change color based on theme -->
      <img :src="logoUrl" width="32" />
    </router-link>

    <template v-if="showBoardsDropdown">
      <a id="boardSwitcher" >
        <b-icon-arrow-left-right />

        <b-popover
          target="boardSwitcher"
          :offset="10"
          placement="right"
          triggers="click blur"
        >
          <b-list-group flush>
            <b-list-group-item
              :to="`/board/${id}`"
              :key="id"
              v-for="{ name, id } in sortedBoards"
              :active="board.id === id"
            >
              {{ name }}
            </b-list-group-item>
          </b-list-group>
        </b-popover>
      </a>
    </template>

    <b-button
      v-else-if="showBoardTitle"
      class="p-0 px-1"
      variant="transparent"
    >
      {{ board.name }}
    </b-button>

    <div class="mt-auto">
      <a id="settingsPopover" class="py-2 d-block">
        <b-icon-gear />
      </a>

      <b-popover
        target="settingsPopover"
        :offset="10"
        placement="right"
        triggers="click blur"
      >
        <b-list-group flush>
          <b-list-group-item
            title="Tags"
            v-b-tooltip.hover.right
            :to="{ name: 'tags' }"
          >
            <b-icon-tags />
            Tags
          </b-list-group-item>

          <b-list-group-item
            title="Wallpapers"
            v-b-tooltip.hover.right
            :to="{ name: 'wallpapers' }"
          >
            <b-icon-file-richtext />
            Wallpapers
          </b-list-group-item>

          <b-list-group-item
            title="Language"
            v-b-tooltip.hover.right
            :to="{ name: 'language' }"
          >
            <b-icon-chat-left-text />
            Language
          </b-list-group-item>
          <b-list-group-item
            title="Themes"
            v-b-tooltip.hover.right
            :to="{ name: 'themes' }"
          >
            <b-icon-droplet />
            Themes
          </b-list-group-item>
          <b-list-group-item
            title="Releases"
            v-b-tooltip.hover.right
            :to="{ name: 'releases' }"
          >
            <b-icon-mailbox />
            Releases
          </b-list-group-item>

          <b-list-group-item
            title="About"
            v-b-tooltip.hover.right
            :to="{ name: 'about' }"
          >
            <b-icon-question />
            About
          </b-list-group-item>
        </b-list-group>
      </b-popover>

      <router-link
        title="Account"
        v-b-tooltip.hover.right
        :to="{ name: 'account' }"
        class="mb-2 mt-3 d-block"
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
