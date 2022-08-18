<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          variant="light"
          class="mr-2"
          :to="{ name: 'settings' }"
        >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Tags
      </div>
    </portal>

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

    <div class="field mr-auto ml-auto" v-else>
      <b-button
        v-for="({ textColor, bgColor, name, games }, index) in tags"
        @click="$router.push({ name: 'tag.edit', params: { id: index } })"
        rounded
        block
        variant="transparent"
        :style="`background-color: ${bgColor}; color: ${textColor}`"
        :key="name"
      >
        {{ name }} {{ games.length ? `(${games.length})` : '' }}
      </b-button>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
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
