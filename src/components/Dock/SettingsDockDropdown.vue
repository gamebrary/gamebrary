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
      <i class="fa-regular fa-gear"></i>
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
          Game covers in board preview
        </span>
      </b-form-checkbox>

      <b-form-checkbox
        switch
        @change="toggleTransparency"
        :checked="transparencyEnabled"
      >
        <span :class="darkTheme ? 'text-light' : null">Transparency</span>
      </b-form-checkbox>
      <!-- TODO: add option to use system theme (auto) -->
    </b-dropdown-form>

    <div class="p-1">
      <span :class="darkTheme ? 'text-light' : null">Menu position</span>
      
      <b-form-select
        :value="navPosition"
        :options="navPositionOptions"
        @change="setNavPosition"
      />
    </div>

    <div class="p-1">
      <span :class="darkTheme ? 'text-light' : null">Preferred age rating</span>
      
      <b-form-select
        :value="ageRating"
        :options="ageRatingOptions"
        @change="setPreferredGameRating"
      />
    </div>
  
    <b-dropdown-item
      :to="{ name: 'account' }"
    >
      <i class="fa-regular fa-user-shield fa-fw" />
      <span class="ml-2">Account</span>
    </b-dropdown-item>

    <b-dropdown-item
      href="https://github.com/romancm/gamebrary/"
      target="_blank"
    >
      <i class="fa-brands fa-github fa-fw" />
      GitHub
    </b-dropdown-item>

    <b-dropdown-item v-b-modal.keyboard-shortcuts>
      <i class="fa-regular fa-keyboard fa-fw" />

      <span class="ml-2">Keyboard Shortcuts</span>
    </b-dropdown-item>

    <b-dropdown-item
      :to="{ name: 'help' }"
      id="help"
    >
      <i class="fa-duotone fa-question fa-fw" />

      <span class="ml-2">Help</span>
    </b-dropdown-item>

    <!-- TODO: add i18n -->
    <!-- <b-dropdown-item disabled>
      <i class="fa-solid fa-language" />
      <span class="ml-2">Change language</span>
    </b-dropdown-item> -->

    <!-- TODO: finish steam integration -->
    <!-- <b-dropdown-item
      :to="{ name: 'steam.settings' }"
      disabled
    >
      <i class="fab fa-steam fa-fe" aria-hidden />
      <span class="ml-2">Steam</span>
    </b-dropdown-item> -->
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { AGE_RATINGS } from '@/constants';

export default {
  AGE_RATINGS,

  data() {
    return {
      navPositionOptions: [
        { value: 'top', text: 'Top' },
        { value: 'right', text: 'Right' },
        { value: 'bottom', text: 'Bottom' },
        { value: 'left', text: 'Left' },
      ],
    };
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'isVerticalNav', 'showGameThumbnails', 'dockDropdownProps', 'navPosition', 'transparencyEnabled', 'ageRating']),

    ageRatingOptions() {
      return AGE_RATINGS.map((rating) => {

        return { 
          value: rating.id,
          text: rating.name,
        }
        console.log('rating', rating);

        // ageRatingOptions: [
        //   { value: 'top', text: 'Top' },
        //   { value: 'right', text: 'Right' },
        //   { value: 'bottom', text: 'Bottom' },
        //   { value: 'left', text: 'Left' },
        // ],
      });
    },
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

    async setPreferredGameRating(ageRating) {
      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          ageRating,
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

    async toggleTransparency() {
      const transparencyEnabled = this.settings?.transparencyEnabled || false;

      const payload = {
        ...this.settings,
        transparencyEnabled: !transparencyEnabled,
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