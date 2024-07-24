<template>
  <div>
    <b-button
      v-b-toggle.collapse-1
      block
      :variant="darkTheme ? 'dark' : 'light'"
    >
      <i class="fa-regular fa-gear fa-fw" />
      Settings
    </b-button>

    <b-collapse id="collapse-1" class="mt-2">
      <b-card bg-variant="dark">
        <b-button
          block
          :variant="darkTheme ? 'dark' : 'light'"
          :to="{ name: 'public.profile', params: { userName } }"
        >
          toggleTransparency
        </b-button>

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
      
        <b-button
          block
          :variant="darkTheme ? 'dark' : 'light'"
          :to="{ name: 'account' }"
        >
          <i class="fa-regular fa-user-shield fa-fw" />
          <span class="ml-2">Account</span>
        </b-button>

        <b-button
          block
          :variant="darkTheme ? 'dark' : 'light'"
          href="https://github.com/romancm/gamebrary/"
          target="_blank"
        >
          <i class="fa-brands fa-github fa-fw" />
          GitHub
        </b-button>

        <b-button
          v-b-modal.keyboard-shortcuts
          block
          :variant="darkTheme ? 'dark' : 'light'"
        >
          <i class="fa-regular fa-keyboard fa-fw" />

          <span class="ml-2">Keyboard Shortcuts</span>
        </b-button>

        <b-button
          :to="{ name: 'help' }"
          id="help"
          block
          :variant="darkTheme ? 'dark' : 'light'"
        >
          <i class="fa-duotone fa-question fa-fw" />

          <span class="ml-2">Help</span>
        </b-button>
      </b-card>
    </b-collapse>

    <!-- TODO: add i18n -->
    <!-- <b-button disabled>
      <i class="fa-solid fa-language" />
      <span class="ml-2">Change language</span>
    </b-button> -->

    <!-- TODO: finish steam integration -->
    <!-- <b-button
      :to="{ name: 'steam.settings' }"
      disabled
    >
      <i class="fab fa-steam fa-fe" aria-hidden />
      <span class="ml-2">Steam</span>
    </b-button> -->
  </div>
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
        { value: 'bottom', text: 'Bottom' },
      ],
    };
  },

  computed: {
    ...mapState(['settings']),
    ...mapGetters(['darkTheme', 'showGameThumbnails', 'navPosition', 'transparencyEnabled', 'ageRating']),

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