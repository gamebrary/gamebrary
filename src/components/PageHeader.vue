<template lang="html">
  <nav class="position-fixed d-flex flex-column p-0 vh-100 text-center">
    <router-link :to="{ name: 'dashboard' }" class="mt-2 mb-3">
      <!-- TODO: use svg, change color based on theme -->
      <img :src="logoUrl" width="32" />
    </router-link>

    <template v-if="hasMultipleBoards">
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
          {{ $t('settings.tags') }}
        </b-dropdown-item>

        <b-dropdown-item title="Wallpapers" :to="{ name: 'wallpapers' }">
          <b-icon-file-richtext />
          {{ $t('settings.wallpapers') }}
        </b-dropdown-item>

        <b-dropdown-item title="Language" :to="{ name: 'language' }">
          <b-icon-chat-left-text />
          {{ $t('settings.language') }}
        </b-dropdown-item>
        <b-dropdown-item title="Themes" :to="{ name: 'themes' }">
          <b-icon-droplet />
          {{ $t('settings.themes') }}
        </b-dropdown-item>
        <b-dropdown-item title="Releases" :to="{ name: 'releases' }">
          <b-icon-mailbox />
          {{ $t('settings.releases') }}
        </b-dropdown-item>

        <b-dropdown-item title="About" :to="{ name: 'about' }">
          <b-icon-question />
          {{ $t('settings.about') }}
        </b-dropdown-item>
      </b-dropdown>

      <router-link
        :title="$t('settings.account')"
        class="mb-2 mt-3 d-block"
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
      const noTheme = Boolean(settings && !settings.theme);
      const darkTheme = Boolean(settings && settings.theme && settings.theme.dark);
      const isDark = noTheme || darkTheme;

      return `/static/gamebrary-logo${isDark ? '' : '-dark'}.png`;
    },

    routeName() {
      return this.$route.name;
    },

    hasMultipleBoards() {
      return this.$route.name === 'board' && this.board.name && this.sortedBoards.length > 1;
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
