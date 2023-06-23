<template lang="html">
  <b-form
    class="small-container d-flex"
    @submit.prevent="search"
  >
    <b-form-input
      v-model="searchText"
      type="search"
      debounce="500"
      placeholder="Search"
      class="mr-3"
    />

    <b-button type="submit">
      <b-spinner v-if="loading" small />

      <i
        v-else
        class="fas fa-search"
        aria-hidden
      />
    </b-button>
  </b-form>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    loading: Boolean,
  },

  data() {
    return {
      searchText: '',
    };
  },

  mounted() {
    this.searchText = this.$route.query.q || '';
  },

  methods: {
    search() {
      if (this.$route.query?.q === this.searchText) return;

      this.$router.push({ name: 'search', query: { ...this.$route.query, q: this.searchText } });
    },
  },
};
</script>
