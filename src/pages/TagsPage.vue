<template lang="html">
  <b-container fluid>
    <portal to="pageTitle">Tags</portal>

    <portal v-if="!loading && tags.length > 0" to="headerActions">
      <b-button
        class="mr-2"
        variant="light"
        :to="{ name: 'tag.create' }"
      >
        Add tag
      </b-button>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <empty-state
      v-else-if="tags.length === 0"
      message="Tags are a great way to organize your collection"
     >
       <b-button
         variant="light"
         :to="{ name: 'tag.create' }"
       >
         Create a tag
       </b-button>
     </empty-state>

    <tags-list v-else />
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';
import TagsList from '@/components/Tags/TagsList';

export default {
  components: {
    EmptyState,
    TagsList,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['tags']),
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      this.loading = true;

      await this.$store.dispatch('LOAD_TAGS')
        .catch(() => { this.loading = false; })

      this.loading = false;
    },
  },
};
</script>
