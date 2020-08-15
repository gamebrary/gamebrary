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
      @shown="loadRepoReadme"
    >
      <vue-markdown
        v-if="readme"
        :source="readme"
      />

      <template v-slot:modal-footer>
        <div>
          <github-button
            href="https://github.com/romancm/gamebrary/subscription"
            data-show-count="true"
            aria-label="Watch romancm/gamebrary on GitHub"
          >
            Watch
          </github-button>
          <github-button
            href="https://github.com/romancm/gamebrary"
            data-show-count="true"
            aria-label="Star romancm/gamebrary on GitHub"
          >
            Star
          </github-button>
          <github-button
            href="https://github.com/romancm/gamebrary/fork"
            data-show-count="true"
            aria-label="Fork romancm/gamebrary on GitHub"
          >
            Fork
          </github-button>
          <github-button
            href="https://github.com/romancm/gamebrary/issues"
            data-show-count="true"
            aria-label="Issue romancm/gamebrary on GitHub"
          >
            Issue
          </github-button>
        </div>

        <small>©{{ currentYear }} Gamebrary</small>
      </template>
      <footer>
      </footer>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import moment from 'moment';
import GithubButton from 'vue-github-button';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    VueMarkdown,
    Placeholder,
    GithubButton,
  },

  data() {
    return {
      readme: null,
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

    async loadRepoReadme() {
      this.readme = await this.$store.dispatch('LOAD_REPO_README');
    },
  },
};
</script>
