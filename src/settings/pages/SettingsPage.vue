<template lang="html">
  <b-container class="pt-3" v-if="user">
    <page-title title="Settings" />

    <div class="small-container">
      <section class="mb-3">
        <p class="mt-2">Menu position</p>

        <b-button
          :variant="navPosition === 'top' ? 'primary' : 'light'"
          @click="setNavPosition('top')"
        >
          Top
        </b-button>

        <b-button
          class="ml-2"
          :variant="navPosition === 'bottom' ? 'primary' : 'light'"
          @click="setNavPosition('bottom')"
        >
          Bottom
        </b-button>

        <b-button
          class="ml-2"
          :variant="navPosition === 'left' ? 'primary' : 'light'"
          @click="setNavPosition('left')"
        >
          Left
        </b-button>

        <b-button
          class="ml-2"
          :variant="navPosition === 'right' ? 'primary' : 'light'"
          @click="setNavPosition('right')"
        >
          Right
        </b-button>
      </section>
      <!-- TODO: game rating -->
      <!-- TODO: erotic category -->

      <hr />

      <b-form-checkbox
        switch
        @input="toggleTheme"
        :checked="darkTheme"
        class="mb-3"
      >
        Dark theme
      </b-form-checkbox>

      <!-- <h3>Game rating type</h3>
      number / stars / minimalist

      <h3>Allow erotic content</h3> -->

      <!-- TODO: make it smart -->
      <!-- <h4 class="mt-4 mb-1">Account</h4>

      <b-button
        class="mr-3"
        variant="light"
        href="https://accounts.google.com/"
        target="_blank"
      >
        Manage account
      </b-button> -->

      <hr />

      <b-button
        variant="danger"
        v-b-modal.deleteAccount
      >
        Delete account
      </b-button>

      <delete-account-modal />

      <hr />

      <b-button
        @click="session_signOut"
      >
        Log out
      </b-button>

      <hr />

      <b-link v-b-modal.keyboard-shortcuts>
        <i class="fa-solid fa-keyboard fa-fw" /> Keyboard Shortcuts
      </b-link>

      <!-- <br /> -->

      <!-- <b-link :to="{ name: 'dev.tools' }">
        <i class="fa fa-cog fa-fw" aria-hidden="true" />
        <span class="ml-2">Dev tools</span>
      </b-link> -->
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

import sessionMixin from '@/mixins/sessionMixin';

export default {
  components: {
    DeleteAccountModal,
  },

  mixins: [sessionMixin],

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'navPosition']),
  },

  methods: {
    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      // TODO: commit first then save settings, to allow unauthed use
      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },

    async setNavPosition(navPosition) {
      const payload = {
        ...this.settings,
        navPosition,
      };

      // TODO: commit first then save settings, to allow unauthed use
      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
