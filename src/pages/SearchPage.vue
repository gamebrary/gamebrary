<template lang="html">
  <b-container fluid class="mt-2">
    <page-title
      title="Search"
    />

    <b-form inline>
      <label class="sr-only" for="inline-form-input-name">Name</label>
      <b-form-input
        v-model="text"
        placeholder="Search"
        type="search"
        trim
      />

      <label class="sr-only" for="inline-form-input-username">Username</label>
      <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input id="inline-form-input-username" placeholder="Username"></b-form-input>
      </b-input-group>

      <!-- <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox> -->

      <b-button variant="light">Search</b-button>
    </b-form>

    <div>
      results here
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      text: '',
    };
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
