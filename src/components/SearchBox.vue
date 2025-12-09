<template lang="html">
  <form @submit.prevent="search">
    <div class="input-group">
      <input
        v-model="searchText"
        type="search"
        class="form-control"
        placeholder="Search games"
        @input="debounceSearch"
      />

      <button type="submit" class="btn btn-outline-secondary">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

        <i
          v-else
          class="fas fa-search"
          aria-hidden
        />
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },

  data() {
    return {
      searchText: '',
      debounceTimer: null,
    };
  },

  mounted() {
    this.searchText = this.$route.query.q || '';
  },

  methods: {
    debounceSearch() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.search();
      }, 500);
    },
    search() {
      if (this.$route.query?.q === this.searchText || this.searchText === '') return;

      this.$router.push({ name: 'search', query: { ...this.$route.query, q: this.searchText } });
    },
  },
};
</script>
