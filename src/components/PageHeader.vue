<template lang="html">
  <nav
    class="border rounded position-fixed d-flex flex-column p-0 m-2 text-center"
    :class="{ 'bg-dark text-white': nightMode }"
  >
    <router-link :to="{ name: 'dashboard' }" class="mt-2 mb-3">
      <img
        :src="`/static/gamebrary-logo${nightMode ? '' : '-dark'}.png`"
        width="32"
      />
    </router-link>

    <board-switcher />

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

      <b-button
        variant="link"
        :title="$t('navMenu.theme')"
        v-b-tooltip.hover.right
        @click="toggleTheme"
      >
        <icon :name="nightMode ? 'moon' : 'sun'" />
      </b-button>

      <!-- <b-button
        :title="$t('navMenu.upgrade')"
        :to="{ name: 'upgrade' }"
        variant="link"
        v-b-tooltip.hover.right
      >
        <icon name="star-fill" />
      </b-button> -->

      <router-link
        :title="$t('settings.account')"
        class="mb-2 mt-3 d-block"
        :to="{ name: 'account' }"
      >
        <b-avatar
          v-if="user && user.photoURL"
          v-b-tooltip.hover.right
          small
          variant="info"
          badge-variant="danger"
          :title="$t('navMenu.account')"
          :badge="notification"
          :src="user.photoURL"
        />
      </router-link>
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
    ...mapState(['board', 'user', 'notification', 'settings']),
    ...mapGetters(['nightMode']),
  },

  methods: {
    toggleTheme() {
      this.$store.commit('UPDATE_SETTING', { key: 'nightMode', value: !this.nightMode });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
        });
    },
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
