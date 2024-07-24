<template lang="html">
  <div>
    <b-container>
      <b-row>
        <b-col cols="12">
          <div class="pb-5">
            main two
            <div class="py-4 bg-primary text-center text-light">.bg-primary</div>
            <div class="py-4 bg-secondary text-center">.bg-secondary</div>
            
            complementary
            <div class="py-4 bg-muted text-center">.bg-muted</div>
            <div class="py-4 bg-info text-center">.bg-info</div>
            
            black and white
            <div class="py-4 bg-white text-center">.bg-white</div>
            <div class="py-4 bg-black text-center text-light">.bg-black</div>
            <div class="py-4 bg-dark text-center text-light">.bg-dark</div>
            <div class="py-4 bg-light text-center">.bg-light</div>

            statuses
            <div class="py-4 bg-success text-center">.bg-success</div>
            <div class="py-4 bg-warning text-center">.bg-warning</div>
            <div class="py-4 bg-danger text-center">.bg-danger</div>
          </div>

          <b-button-group class="mb-3">
            <b-button
              v-for="variant in variants"
              :key="variant"
              :variant="variant"
              @click="variantSelected = variant"
            >
              {{ variant }}
            </b-button>
          </b-button-group>
        </b-col>

        <b-col cols="3">
          <h1>Axiom Verge 1</h1>
          <h2>Axiom Verge 2</h2>
          <h3>Axiom Verge 3</h3>
          <h4>Axiom Verge 4</h4>
          <h5>Axiom Verge 5</h5>
          <h6>Axiom Verge 6</h6>
          <p>Paragraph</p>
        </b-col>

        <b-col cols="3">
          <b-dropdown text="Dropdown Button">
            <b-dropdown-item>First Action</b-dropdown-item>
            <b-dropdown-item>Second Action</b-dropdown-item>
            <b-dropdown-item>Third Action</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item active>Active action</b-dropdown-item>
            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
          </b-dropdown>
        </b-col>

        <b-col cols="3">
          <b-alert show variant="primary">Primary Alert</b-alert>
          <b-alert show variant="secondary">Secondary Alert</b-alert>
          <b-alert show variant="success">Success Alert</b-alert>
          <b-alert show variant="danger">Danger Alert</b-alert>
          <b-alert show variant="warning">Warning Alert</b-alert>
          <b-alert show variant="info">Info Alert</b-alert>
          <b-alert show variant="light">Light Alert</b-alert>
          <b-alert show variant="dark">Dark Alert</b-alert>
        </b-col>
      </b-row>

      <b-button
        @click="$store.commit('SET_SESSION_EXPIRED', true)"
        class="mr-3"
        variant="warning"
      >
        Expire session
      </b-button>

      <b-button
        @click="$store.commit('CLEAR_CACHE_GAME_DATA')"
        variant="warning"
      >
        Clear game cache
      </b-button>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      variantSelected: 'white',
      variants: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'black',
        'white',
      ],
    };
  },
};
</script>
