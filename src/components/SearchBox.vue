<template lang="html">
  <b-form @submit.prevent="search" class="search-box">
    <b-input-group>
      <b-form-input
        v-model="searchText"
        type="search"
        autofocus
        debounce="500"
        :placeholder="$t('board.addGame.inputPlaceholder')"
      />

      <b-input-group-append>
        <b-button @click="search">
          <i class="fa-solid fa-magnifying-glass" />
          Search
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
    };
  },

  mounted() {
    this.searchText = this.$route.query.s || '';
  },

  methods: {
    search() {
      if (!this.searchText || this.$route.query.s === this.searchText) return;

      this.$router.push({ name: 'search', query: { s: this.searchText } });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-box {
    max-width: 100%;
    width: 320px;
  }
</style>
