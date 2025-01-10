<template>
  <div class="px-3 text-center d-flex align-items-center justify-content-center flex-column">
    <div>
      <b-button
        :variant="darkTheme ? 'dark' : 'light'"
        href="https://github.com/romancm/gamebrary/"
        target="_blank"
        title="GitHub"
        size="lg"
        v-b-tooltip.hover
      >
        <i class="fa-brands fa-github" />
      </b-button>

      <b-button
        v-b-toggle.keyboard-shortcuts-sidebar
        :variant="darkTheme ? 'dark' : 'light'"
        title="Keyboard Shortcuts"
        v-b-tooltip.hover
        size="lg"
      >
        <i class="fa-solid fa-command" />
      </b-button>

      <b-button
        :to="{ name: 'help' }"
        id="help"
        title="Help"
        :variant="darkTheme ? 'dark' : 'light'"
        size="lg"
        v-b-tooltip.hover
      >
        <i class="fa-regular fa-circle-info" />
      </b-button>

      <b-button
        @click="toggleTheme"
        :variant="darkTheme ? 'dark' : 'light'"
        size="lg"
        v-b-tooltip.hover
        title="Toggle theme"
      >
        <i v-if="darkTheme" class="fa-solid fa-sun" />
        <i v-else class="fa-solid fa-moon" />
      </b-button>
    </div>

    <div>&copy; {{ currentYear }} Gamebrary</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {

  computed: {
    ...mapState(['settings']),
    ...mapGetters(['darkTheme', 'showGameThumbnails', 'transparencyEnabled', 'ageRating']),

    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    async toggleTheme() {
      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          darkTheme: !this.settings?.darkTheme,
        });
      } catch (error) {
        this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
      }
    },
  },
}
</script>