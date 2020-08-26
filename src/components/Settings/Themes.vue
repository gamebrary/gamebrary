<template lang="html">
  <b-dropdown-item v-b-modal:themes>
    <b-icon-mailbox class="mr-1" />
    Themes

    <b-modal
      id="themes"
      title="Themes"
      modal-class="themes"
      scrollable
      hide-footer
      size="lg"
      @show="init"
    >
      <placeholder v-if="loading" />

      <b-row v-else>
        <b-col
          cols="3"
          v-for="theme in themes"
          :key="theme.name"
          class="mb-4"
          @click="setTheme(theme)"
        >
          <b-img
            :src="theme.thumbnail"
            fluid
            thumbnail
          />
        </b-col>
      </b-row>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import { mapState } from 'vuex';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    Placeholder,
  },

  data() {
    return {
      loading: false,
      theme: null,
    };
  },

  computed: {
    ...mapState(['themes', 'settings']),
  },

  methods: {
    setTheme(theme) {
      this.theme = theme;

      document.querySelector('link[rel="stylesheet"').href = theme.cssCdn;

      const settings = {
        ...this.settings,
        theme: this.theme,
      };

      this.$store.dispatch('SAVE_SETTINGS', settings)
        .then(() => {
          this.$bvToast.toast('Settings saved', { title: 'Success', variant: 'success' });
          this.loading = false;
        })
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
          this.loading = false;
        });
    },

    init() {
      this.loadThemes();

      const { settings } = this;

      this.theme = settings.theme || null;
    },

    async loadThemes() {
      this.loading = true;

      await this.$store.dispatch('LOAD_THEMES')
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('There was an error loading themes', { title: 'Error', variant: 'danger' });
        });

      this.loading = false;
    },
  },
};
</script>
