<template lang="html">
  <b-modal
    id="authModal"
    hide-footer
    centered
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="user ? 'Forbidden' : 'Gamebrary'"
        @close="close"
      >
        <template v-slot:header>
          <img
            class="logo mr-2"
            src="/static/gamebrary-logo.png"
          />
        </template>
      </modal-header>
    </template>

    <b-alert v-if="user" show variant="warning">
      Not allowed
    </b-alert>

    <div class="text-center" v-else>
      <b-img
        src="/static/img/screenshot-1.jpg"
        class="rounded shadow w-75 ml-auto mr-auto mt-2 mb-3"
        block
      />

      <h2>Hi 👋!</h2>

      <p>Gamebrary is an open source tool to organize video game collections.</p>

      <b-button
        @click="getStarted"
        variant="success"
      >
        <i class="fas fa-rocket fa-fw" aria-hidden />
        Get started!
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },

  methods: {
    getStarted() {
      this.$bvModal.hide('authModal');
      this.$router.push({ name: 'auth' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.logo {
  float: left;
  height: 40px;
}
</style>
