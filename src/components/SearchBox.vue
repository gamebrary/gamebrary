<template lang="html">
  <b-form @submit.prevent="search">
    <b-input-group>
      <b-form-input
        v-model="searchText"
        type="search"
        size="lg"
        debounce="500"
        placeholder="Search games"
      />

      <b-input-group-append>
        <b-button type="submit">
          <b-spinner v-if="loading" small />

          <i
            v-else
            class="fas fa-search"
            aria-hidden
          />
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </b-form>
</template>

<script>
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
      if (this.$route.query?.q === this.searchText || this.searchText === '') return;

      this.$router.push({ name: 'search', query: { ...this.$route.query, q: this.searchText } });
    },
  },
};
</script>
