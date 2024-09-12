<template>
  <div class="p-3">
    <div class="mt-1 text-center d-flex justify-content-between">
      <div class="d-flex justify-content-between align-items-center">
        <img
          src="/logo.png"
          alt=""
          height="26"
          class="mr-2"
        />

        &copy; {{ currentYear }} Gamebrary
      </div>

      <div>
        <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          href="https://github.com/romancm/gamebrary/"
          target="_blank"
          title="GitHub"
          v-b-tooltip.hover
        >
          <i class="fa-brands fa-github" />
        </b-button>

        <b-button
          v-b-toggle.keyboard-shortcuts-sidebar
          :variant="darkTheme ? 'dark' : 'light'"
          title="Keyboard Shortcuts"
          v-b-tooltip.hover
        >
          <i class="fa-solid fa-command" />
        </b-button>

        <b-button
          :to="{ name: 'help' }"
          id="help"
          title="Help"
          :variant="darkTheme ? 'dark' : 'light'"
          v-b-tooltip.hover
        >
          <i class="fa-regular fa-circle-info" />
        </b-button>

        <b-button
          @click="toggleTheme"
          :variant="darkTheme ? 'dark' : 'light'"
          v-b-tooltip.hover
          title="Toggle theme"
        >
          <i v-if="darkTheme" class="fa-solid fa-sun" />
          <i v-else class="fa-solid fa-moon" />
        </b-button>
      </div>
    </div>
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
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },
  },
}
</script>