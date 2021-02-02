<template lang="html">
  <b-modal
    id="authModal"
    hide-footer
    centered
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Gamebrary"
        subtitle="Ditch the spreadsheet. Organize your games with Gamebrary!"
        @close="close"
      >
        <template v-slot:header>
          <img
            class="logo mr-2"
            :src="`/static/gamebrary-logo${nightMode ? '' : '-dark'}.png`"
          />
        </template>
      </modal-header>
    </template>

    <div class="text-center">
      <b-img
        src="/static/img/screenshot-1.jpg"
        class="rounded shadow w-75 ml-auto mr-auto mt-2 mb-3"
        block
      />

      <h2>Hi 👋!</h2>

      <p>Gamebrary is an open source tool to organize video game collections.</p>

      <b-button
        :to="{ name: 'auth' }"
        variant="primary"
      >
        <i class="fab fa-google fa-fw" aria-hidden />
        Authenticate with Google
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nightMode']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.logo {
  float: left;
  height: 40px;
}
</style>
