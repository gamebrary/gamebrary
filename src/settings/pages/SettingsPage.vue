<template lang="html">
  <b-container class="pt-3">
    <page-title title="Settings" />

    <!-- <b-button
      v-if="user"
      @click="toggleTheme"
    >
      <i v-if="darkTheme" class="fa-solid fa-sun fa-fw" />
      <i v-else class="fa-solid fa-moon fa-fw" />

      Change theme
    </b-button> -->

    <h4 class="mt-2">Nav position</h4>

    <b-button
      @click="setNavPosition('top')"
    >
      Top
    </b-button>

    <b-button
      class="ml-3"
      @click="setNavPosition('bottom')"
    >
      Bottom
    </b-button>

    <b-button
      class="ml-3"
      @click="setNavPosition('left')"
    >
      Left
    </b-button>

    <b-button
      class="ml-3"
      @click="setNavPosition('right')"
    >
      Right
    </b-button>

    <b-form-checkbox
      switch
      @input="toggleTheme"
      :checked="darkTheme"
      class="mb-3"
    >
      Dark theme
    </b-form-checkbox>

    <hr />

    <h3 class="mt-4 mb-1">Account</h3>
    <!-- <p></p> -->

    <b-button
      class="mr-3"
      variant="light"
      href="https://accounts.google.com/"
      target="_blank"
    >
      Manage account
    </b-button>

    <b-button
      variant="danger"
      v-b-modal.deleteAccount
    >
      Delete account
    </b-button>

    <delete-account-modal />


    <b-link v-b-modal.keyboard-shortcuts>
      <i class="fa-solid fa-keyboard fa-fw" /> Keyboard Shortcuts
    </b-link>

    <br />

    <b-button
      class="mt-3"
      @click="session_signOut"
    >
      Log out
    </b-button>

    <!-- <b-link :to="{ name: 'dev.tools' }">
      <i class="fa fa-cog fa-fw" aria-hidden="true" />
      <span class="ml-2">Dev tools</span>
    </b-link> -->
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
    ...mapGetters(['darkTheme']),
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

      console.log('save this', payload);

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
