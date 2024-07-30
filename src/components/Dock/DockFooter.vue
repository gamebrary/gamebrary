<template>
  <div class="p-3">
    <div class="d-flex justify-content-end">
      <!-- TODO: add i18n -->
      <!-- <b-button disabled>
        <i class="fa-solid fa-language" />
        <span class="ml-2">Change language</span>
      </b-button> -->
    </div>

    <div class="mt-1 text-center d-flex justify-content-between small">
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
          size="sm"
          class="ml-1"
        >
          <i class="fa-brands fa-github fa-fw" />
        </b-button>

        <b-button
          v-b-modal.keyboard-shortcuts
          :variant="darkTheme ? 'dark' : 'light'"
          title="Keyboard Shortcuts"
          size="sm"
          v-b-tooltip.hover
          class="ml-1"
        >
          <i class="fa-solid fa-command fa-fw" />
        </b-button>

        <b-button
          :to="{ name: 'help' }"
          id="help"
          title="Help"
          :variant="darkTheme ? 'dark' : 'light'"
          size="sm"
          v-b-tooltip.hover
          class="ml-1"
        >
          <i class="fa-regular fa-circle-info fa-fw" />
        </b-button>

        <b-button
          @click="toggleTheme"
          :variant="darkTheme ? 'dark' : 'light'"
          size="sm"
          v-b-tooltip.hover
          class="ml-1"
          title="Toggle theme"
        >
          <i v-if="darkTheme" class="fa-solid fa-sun fa-fw" />
          <i v-else class="fa-solid fa-moon fa-fw" />
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