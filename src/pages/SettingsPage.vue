<template lang="html">
  <div class="pt-3">
    <PageTitle title="Settings" />

    <div>
      <section class="mb-3">
        <p class="mt-2">Menu position</p>

        <div class="bg-light p-2 rounded" style="width: 140px;">
          <b-button
            block
            :variant="navPosition === 'top' ? 'primary' : 'light'"
            size="sm"
            class="mb-1"
            @click="setNavPosition('top')"
          >
            <i class="fa fa-arrow-up" />
          </b-button>

          <div class="d-flex align-items-start">
            <b-button
              block
              size="sm"
              class="m-0 py-5 d-flex flex-column align-items-center"
              :variant="navPosition === 'left' ? 'primary' : 'light'"
              @click="setNavPosition('left')"
            >
              <i class="fa fa-arrow-left" />
            </b-button>

            <span class="w-100" />

            <b-button
              block
              size="sm"
              class="m-0 py-5 d-flex flex-column align-items-center"
              :variant="navPosition === 'right' ? 'primary' : 'light'"
              @click="setNavPosition('right')"
            >
              <i class="fa fa-arrow-right" />
            </b-button>
          </div>

          <b-button
            block
            :variant="navPosition === 'bottom' ? 'primary' : 'light'"
            size="sm"
            class="mt-1"
            @click="setNavPosition('bottom')"
          >
            <i class="fa fa-arrow-down" />
          </b-button>
        </div>
      </section>

      <hr />

      <section class="mb-3">
        <p class="mt-2">Preferred age rating</p>

        <b-button
          :variant="ageRating === 'all' ? 'primary' : 'light'"
          class="mb-2 mr-2"
          @click="setPreferredGameRating('all')"
        >
          Show all
        </b-button>

        <b-button
          v-for="{ id, name, title } in $options.AGE_RATINGS"
          class="mr-2 mb-2"
          :key="id"
          v-b-tooltip.hover
          :title="title"
          :variant="ageRating === id ? 'primary' : 'light'"
          @click="setPreferredGameRating(id)"
        >
          {{ name }}
        </b-button>
      </section>

      <hr />

      <b-form-checkbox
        switch
        @input="toggleTheme"
        :checked="darkTheme"
        class="mb-3"
      >
        Dark theme
      </b-form-checkbox>


      <b-form-checkbox
        switch
        @input="toggleCoversInMiniBoards"
        :checked="coversInMiniBoards"
        class="mb-3"
      >
        Show game covers in mini boards
      </b-form-checkbox>

      <!-- <h3>Game rating type</h3>
      number / stars / minimalist

      <h3>Allow erotic content</h3> -->

      <!-- <h4 class="mt-4 mb-1">Account</h4>

      <b-button
        class="mr-3"
        variant="light"
        href="https://accounts.google.com/"
        target="_blank"
      >
        Manage account
      </b-button> -->

      <!-- TODO: migrate and restore delete account modal, use firebase extension? -->
      <!-- <hr />

      <b-button
        variant="danger"
        v-b-modal.deleteAccount
      >
        Delete account
      </b-button>

      <delete-account-modal /> -->

      <hr />

      <b-button
        @click="signOut"
      >
        Log out
      </b-button>

      <br />

      <b-link :to="{ name: 'dev.tools' }">
        <i class="fa fa-cog fa-fw" aria-hidden="true" />
        <span class="ml-2">Dev tools</span>
      </b-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { AGE_RATINGS } from '@/constants';
// import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  AGE_RATINGS,

  components: {
    // DeleteAccountModal,
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'navPosition', 'ageRating', 'coversInMiniBoards']),
  },

  methods: {
		async signOut() {
			await this.$store.dispatch('SIGN_OUT');
			this.$bvToast.toast('Logged out');

			this.$store.commit('CLEAR_SESSION');
			this.$router.replace({ name: 'auth' });
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

    async toggleCoversInMiniBoards() {
      const { settings } = this;
      const coversInMiniBoards = settings?.coversInMiniBoards || false;

      const payload = {
        ...settings,
        coversInMiniBoards: !coversInMiniBoards,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },

    async setNavPosition(navPosition) {
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
