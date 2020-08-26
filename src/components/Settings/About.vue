<template lang="html">
  <b-dropdown-item v-b-modal:about>
    <b-icon-question class="mr-1" />
    About

    <b-modal
      id="about"
      title="About Gamebrary"
      scrollable
      footer-class="p-2 d-flex align-items-center justify-content-between"
      size="lg"
      @show="load"
    >
      <vue-markdown
        v-if="readme"
        :source="readme"
      />

      <template v-slot:modal-footer>
        <div v-if="repo">
          <b-button
            size="sm"
            href="https://github.com/romancm/gamebrary/subscription"
            target="_blank"
          >
            Watch <b-badge variant="light">{{ repo.watchers }}</b-badge>
          </b-button>

          <b-button
            size="sm"
            href="https://github.com/romancm/gamebrary"
            target="_blank"
          >
            Star <b-badge variant="light">{{ repo.stargazers_count }}</b-badge>
          </b-button>

          <b-button
            size="sm"
            href="https://github.com/romancm/gamebrary/fork"
            target="_blank"
          >
            Fork <b-badge variant="light">{{ repo.forks }}</b-badge>
          </b-button>

          <b-button
            size="sm"
            href="https://github.com/romancm/gamebrary/issues"
            target="_blank"
          >
            Issues <b-badge variant="light">{{ repo.open_issues }}</b-badge>
          </b-button>
        </div>

        <small>©{{ currentYear }} Gamebrary</small>
      </template>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import moment from 'moment';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    VueMarkdown,
    Placeholder,
  },

  data() {
    return {
      readme: null,
      repo: null,
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    formatDate(date) {
      return moment(date).format('LL');
    },

    async load() {
      this.readme = await this.$store.dispatch('LOAD_GITHUB_README');
      this.repo = await this.$store.dispatch('LOAD_GITHUB_REPOSITORY');
    },
  },
};
</script>
