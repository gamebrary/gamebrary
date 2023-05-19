<template lang="html">
  <b-button v-if="isVerticalNav" :to="{ name: 'search' }">
    <i class="fa fa-search" aria-hidden="true" />
  </b-button>

  <div v-else class="search-box">
    <b-form
      @submit.prevent="search"
      :class="[{ 'd-none d-sm-block': !isSearchPage }, 'mw-100']"
      style="width: 180px"
    >
      <b-input-group>
        <b-form-input
          v-model="searchText"
          type="search"
          debounce="500"
          placeholder="Search"
        />

        <b-input-group-append>
          <b-button type="submit">
            <b-spinner
              v-if="loading"
              small
            />

            <i
              v-else
              class="fas fa-search"
              aria-hidden
            />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form>

    <b-button v-if="!isSearchPage" :to="{ name: 'search' }" class="d-sm-none">
      <i class="fa fa-search" aria-hidden="true" />
    </b-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

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

  computed: {
    ...mapState(['settings']),
    ...mapGetters(['navPosition', 'isVerticalNav']),

    isSearchPage() {
      return this.$route.name === 'search';
    },
  },

  methods: {
    search() {
      if (this.$route.query?.q === this.searchText) return;

      this.$router.push({ name: 'search', query: { ...this.$route.query, q: this.searchText } });
    },
  },
};
</script>
