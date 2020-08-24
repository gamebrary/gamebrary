<template lang="html">
  <div class="d-flex justify-content-center">
    <b-alert show variant="warning" class="mw-75 mt-3 mx-3" style="width: 500px;">
      <h4 class="alert-heading">{{ $t('sessionExpired.title') }}</h4>
      <p>
        Aww yeah, you successfully read this important alert message. This example text is going to
        run a bit longer so that you can see how spacing within an alert works with this kind of
        content.
      </p>
      <hr>
      <p class="mb-0">
        <b-button variant="success" @click="login">{{ $t('sessionExpired.login') }}</b-button>
        <b-button :href="exitUrl">{{ $t('sessionExpired.exit') }}</b-button>
      </p>
    </b-alert>
  </div>
</template>

<script>
export default {
  computed: {
    exitUrl() {
      // TODO: move to getter and replace other instances
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://gamebrary.com';
    },

    homeUrl() {
      // TODO: move to getter and replace other instances
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://app.gamebrary.com';
    },
  },

  methods: {
    login() {
      this.$store.commit('CLEAR_SESSION');
      window.location.href = this.homeUrl;
    },
  },
};
</script>
