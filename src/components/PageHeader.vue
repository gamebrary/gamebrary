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
        v-b-tooltip.hover.right
        :title="$t('navMenu.changeBoard')"
        variant="transparent"
      >
        <template v-slot:button-content>
          <icon name="arrow-switch" />
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
        :title="$t('navMenu.wallpapers')"
        :to="{ name: 'wallpapers' }"
        v-b-tooltip.hover.right
      >
        <icon name="image" />
      </b-button>

      <b-button
        variant="link"
        :title="$t('navMenu.language')"
        :to="{ name: 'language' }"
        v-b-tooltip.hover.right
      >
        <icon name="globe" />
      </b-button>

      <b-button
        variant="link"
        :title="$t('navMenu.releases')"
        :to="{ name: 'releases' }"
        v-b-tooltip.hover.right
      >
        <icon name="megaphone" />
      </b-button>

      <b-button
        variant="link"
        :title="$t('navMenu.about')"
        :to="{ name: 'about' }"
        v-b-tooltip.hover.right
      >
        <icon name="info" />
      </b-button>

      <router-link
        :title="$t('settings.account')"
        class="mb-2 mt-3 d-block"
        :to="{ name: 'account' }"
      >
        <b-avatar
          v-if="user && user.photoURL"
          variant="info"
          small
          :title="$t('navMenu.account')"
          v-b-tooltip.hover.right
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
