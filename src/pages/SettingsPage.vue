<template lang="html">
  <div class="pt-3">
    <PageTitle title="Settings" />

    <div>
      <hr />

      <section class="mb-3">
        <p class="mt-2">Preferred age rating</p>

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
// TODO: restore and finish delete account modal
// import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  AGE_RATINGS,

  components: {
    // DeleteAccountModal,
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'ageRating']),
  },

  methods: {
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
