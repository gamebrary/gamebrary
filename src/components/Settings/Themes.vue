<template lang="html">
  <b-dropdown-item v-b-modal:themes>
    <b-icon-droplet class="mr-1" />
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
      <b-row>
        <b-col
          cols="6"
          lg="4"
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
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import { mapState } from 'vuex';
import Placeholder from '@/components/Placeholder';
import themes from '@/themes';

export default {
  components: {
    Placeholder,
  },

  data() {
    return {
      selectedTheme: {},
      themes,
    };
  },

  computed: {
    ...mapState(['settings']),
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
