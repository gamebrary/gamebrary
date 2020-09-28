<template lang="html">
  <b-container fluid>
    <b-jumbotron
      header="Themes"
      header-level="5"
      fluid
      lead="Select a theme below"
    />

    <b-container>
      <b-row>
        <b-col
          lg="3"
          md="4"
          v-for="theme in themes"
          :key="theme.name"
          class="mb-4"
          @click="setTheme(theme)"
        >
          <b-card
            :title="theme.name"
            title-tag="h6"
            body-class="p-2"
            :border-variant="isSelected(theme) ? 'success' : ''"
            :img-src="theme.thumbnail"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2 clickable"
          >
            <b-card-text>
              {{ theme.description }}
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import themes from '@/themes';

export default {
  data() {
    return {
      selectedTheme: {},
      themes,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    this.init();
  },

  methods: {
    isSelected(theme) {
      return this.selectedTheme.name && theme.name === this.selectedTheme.name;
    },

    async setTheme(theme) {
      this.selectedTheme = theme;

      document.querySelector('link[rel="stylesheet"').href = theme.cssCdn;

      const settings = {
        ...this.settings,
        theme: this.selectedTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
        });

      this.$bvToast.toast('Settings saved', { title: 'Success', variant: 'success' });
    },

    init() {
      const { settings } = this;

      this.selectedTheme = settings.theme || null;
    },
  },
};
</script>
