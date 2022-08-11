<template lang="html">
  <b-container fluid>
    <b-spinner v-if="loading" class="spinner-centered" />

    <b-row v-else>
      <portal to="headerTitle">Tags</portal>

      <portal to="headerActions">
        <b-button
          class="mr-2"
          variant="light"
          :to="{ name: 'tag.create' }"
        >
          Add tag
        </b-button>
      </portal>

      <empty-state
        v-if="showEmptyState"
        message="Tags are a great way to organize your collection"
       >
         <b-button
           variant="light"
           :to="{ name: 'tag.create' }"
         >
           Create a tag
         </b-button>
       </empty-state>

       <b-col v-else>
         <tags-list />
       </b-col>
    </b-row>
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

    showEmptyState() {
      return !this.loading && this.tags?.length === 0;
    },
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
