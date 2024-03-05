<template>
  <b-dropdown
    v-if="user"
    v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
    title="Preferences"
    ref="settingsDropdown"
    v-bind="dockDropdownProps"
    no-caret
  >
    <template #button-content>
        <b-img
          src="/img/dock-icons/settings.png"
          alt="wikipedia"
          width="24"
        />
      </template>

    <b-dropdown-form style="width: auto">
      <b-form-checkbox
        switch
        @change="toggleTheme"
        :checked="darkTheme"
      >
        <span :class="darkTheme ? 'text-light' : null">Dark theme</span>
      </b-form-checkbox>

      <b-form-checkbox
        switch
        @change="toggleGameThumbnails"
        :checked="showGameThumbnails"
      >
        <span :class="darkTheme ? 'text-light' : null">
          Show game thumbnails
        </span>
      </b-form-checkbox>
    </b-dropdown-form>

    <b-form-select
      :value="navPosition"
      :options="options"
      @change="setNavPosition"
    />
  
    <b-dropdown-item
      :to="{ name: 'settings' }"
    >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
      <span class="ml-2">Settings</span>
    </b-dropdown-item>

    <b-dropdown-item
      href="https://github.com/romancm/gamebrary/"
      target="_blank"
    >
      <i class="fa-brands fa-github fa-fw"></i>
      GitHub
    </b-dropdown-item>

    <b-dropdown-item v-b-modal.keyboard-shortcuts>
      <i class="fa-solid fa-keyboard fa-fw" />
      <span class="ml-2">Keyboard Shortcuts</span>
    </b-dropdown-item>

    <b-dropdown-item
      :to="{ name: 'help' }"
      id="help"
    >
      <i class="fa-regular fa-circle-question fa-fw" aria-hidden="true" />
      <span class="ml-2">Help</span>
    </b-dropdown-item>

    <b-dropdown-item disabled>
      <i class="fa-solid fa-language" />
      <span class="ml-2">Change language</span>
    </b-dropdown-item>

    <b-dropdown-item
      :to="{ name: 'steam.settings' }"
      disabled
    >
      <i class="fab fa-steam fa-fe" aria-hidden />
      <span class="ml-2">Steam</span>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      options: [
        { value: 'top', text: 'Top' },
        { value: 'right', text: 'Right' },
        { value: 'bottom', text: 'Bottom' },
        { value: 'left', text: 'Left' },
      ],
    };
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'isVerticalNav', 'showGameThumbnails', 'dockDropdownProps', 'navPosition']),
  },

  methods: {
    async setNavPosition(navPosition) {
      this.$refs.settingsDropdown?.hide();

      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          navPosition,
        });
      } catch (e) {
        this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
      }

      this.saving = false;
    },

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

    async toggleGameThumbnails() {
      const { settings } = this;
      const showGameThumbnails = settings?.showGameThumbnails || false;

      const payload = {
        ...settings,
        showGameThumbnails: !showGameThumbnails,
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