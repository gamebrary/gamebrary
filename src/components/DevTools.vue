<template lang="html">
  <div content-class="mt-3">
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

    <div class="p-3 mb-2 bg-primary text-white">.bg-primary</div>
    <div class="p-3 mb-2 bg-secondary text-white">.bg-secondary</div>
    <div class="p-3 mb-2 bg-success text-white">.bg-success</div>
    <div class="p-3 mb-2 bg-danger text-white">.bg-danger</div>
    <div class="p-3 mb-2 bg-warning text-dark">.bg-warning</div>
    <div class="p-3 mb-2 bg-info text-white">.bg-info</div>
    <div class="p-3 mb-2 bg-light text-dark">.bg-light</div>
    <div class="p-3 mb-2 bg-dark text-white">.bg-dark</div>
    <div class="p-3 mb-2 bg-white text-dark">.bg-white</div>
    <div class="p-3 mb-2 bg-transparent text-dark">.bg-transparent</div>

    <b-dropdown text="Dropdown Button">
      <b-dropdown-item>First Action</b-dropdown-item>
      <b-dropdown-item>Second Action</b-dropdown-item>
      <b-dropdown-item>Third Action</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item active>Active action</b-dropdown-item>
      <b-dropdown-item disabled>Disabled action</b-dropdown-item>
    </b-dropdown>

    <b-alert show variant="primary">Primary Alert</b-alert>
    <b-alert show variant="secondary">Secondary Alert</b-alert>
    <b-alert show variant="success">Success Alert</b-alert>
    <b-alert show variant="danger">Danger Alert</b-alert>
    <b-alert show variant="warning">Warning Alert</b-alert>
    <b-alert show variant="info">Info Alert</b-alert>
    <b-alert show variant="light">Light Alert</b-alert>
    <b-alert show variant="dark">Dark Alert</b-alert>

    <b-button
      @click="$store.commit('SET_SESSION_EXPIRED', true)"
      variant="warning"
    >
      Expire session
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
