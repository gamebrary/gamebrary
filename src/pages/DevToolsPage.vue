<template lang="html">
  <div>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
    <p>Paragraph</p>

    <div class="mb-5">
      <b-button
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        class="mr-2 mb-2"
        @click="variantSelected = variant"
      >
        {{ variant }}
      </b-button>
    </div>


    <div class="mb-5">
      <b-alert show variant="primary">Primary Alert</b-alert>
      <b-alert show variant="secondary">Secondary Alert</b-alert>
      <b-alert show variant="success">Success Alert</b-alert>
      <b-alert show variant="danger">Danger Alert</b-alert>
      <b-alert show variant="warning">Warning Alert</b-alert>
      <b-alert show variant="info">Info Alert</b-alert>
      <b-alert show variant="light">Light Alert</b-alert>
      <b-alert show variant="dark">Dark Alert</b-alert>
    </div>

    <b-dropdown text="Dropdown Button">
      <b-dropdown-item>First Action</b-dropdown-item>
      <b-dropdown-item>Second Action</b-dropdown-item>
      <b-dropdown-item>Third Action</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item active>Active action</b-dropdown-item>
      <b-dropdown-item disabled>Disabled action</b-dropdown-item>
    </b-dropdown>
    
    <b-button
      @click="$store.commit('SET_SESSION_EXPIRED', true)"
      class="mr-3"
      variant="danger"
    >
      Expire session
    </b-button>

    <b-button
      @click="$store.commit('CLEAR_CACHE_GAME_DATA')"
      variant="warning"
    >
      Clear game cache
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      variantSelected: 'white',
      variants: [
        'black',
        'danger',
        'dark',
        'info',
        'light',
        'muted',
        'primary',
        'secondary',
        'success',
        'warning',
        'white',
      ],
    };
  },
};
</script>
