<template lang="html">
  <div class="search-box mr-2">
    <b-form @submit.prevent="search" :class="isSearchPage ? '' : 'd-none d-md-block'">
      <b-input-group>
        <b-form-input
          v-model="searchText"
          type="search"
          autofocus
          debounce="500"
          placeholder="Search"
        />
        <!-- TODO: auto search if already in search page -->

        <b-input-group-append>
          <b-button
            type="submit"
            variant="info"
          >
            <i class="fas fa-search fa-fw" aria-hidden />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form>

    <b-button :class="isSearchPage ? 'd-none' : 'd-md-none'" variant="primary" :to="{ name: 'search' }">
      <i class="fas fa-search fa-fw" aria-hidden />
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
    };
  },

  mounted() {
    this.searchText = this.$route.query.q || '';
  },

  computed: {
    isSearchPage() {
      return this.$route.name === 'search';
    },
  },

  methods: {
    search() {
      if (!this.searchText || this.$route.query?.q === this.searchText) return;

      this.$router.push({ name: 'search', query: { q: this.searchText } });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-box {
    max-width: 100%;
    width: 200px;
  }
</style>
