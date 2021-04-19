<template lang="html">
  <b-modal
    id="devTools"
    centered
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header title="Dev tools" @close="close" />
    </template>

    <!-- TODO: add page version as well -->
    <b-tabs content-class="mt-3">
      <b-tab title="Buttons">
        <div
          v-for="variant in variants"
          :key="variant"
          class="mb-3"
        >
          <b-button
            v-for="size in ['sm', '', 'lg']"
            :variant="variant"
            :key="size"
            :size="size"
            class="mr-2"
          >
            {{ variant }}
          </b-button>
        </div>
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
        'link',
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
