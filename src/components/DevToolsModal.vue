<template lang="html">
  <b-modal
    id="devTools"
    centered
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header title="Dev tools" @close="close" />
    </template>

    <b-tabs content-class="mt-3">
      <b-tab title="Buttons">
        <b-button v-for="variant in variants" :variant="variant" :key="variant">
          {{ variant }}
        </b-button>
      </b-tab>
      <b-tab title="Session">
        <b-button @click="$store.commit('SET_SESSION_EXPIRED', true)">
          Expire session
        </b-button>
      </b-tab>
    </b-tabs>

  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      open: true,
      variants: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ],
    };
  },

  methods: {
    login() {
      this.$store.commit('CLEAR_SESSION');
      this.$store.commit('SET_SESSION_EXPIRED', false);
      window.location.href = this.session_authUrl;
    },

    logout() {
      this.$store.commit('CLEAR_SESSION');
      this.$store.commit('SET_SESSION_EXPIRED', false);

      window.location.href = this.session_publicSiteUrl;
    },
  },
};
</script>
