<template lang="html">
  <div class="global-search">
    <b-form-input
      v-model="searchText"
      type="search"
      debounce="500"
      :placeholder="$t('board.addGame.inputPlaceholder')"
      @update="search"
    />

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
    };
  },

  methods: {
    search(text) {
      console.log(text);
      this.$store.dispatch('CUSTOM_SEARCH', text);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
