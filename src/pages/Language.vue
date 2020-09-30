<template lang="html">
  <div>
    <b-jumbotron
      header="Language"
      header-level="5"
      fluid
    />

    <b-container>
      <b-form-select v-model="language" class="mb-2 w-50">
        <b-form-select-option
          v-for="{ flag, code } in languages"
          :key="code"
          :value="code"
        >
          {{ flag }}  {{ $t(`settings.languages.${code}`) }}
        </b-form-select-option>
      </b-form-select>

      <br>

      <b-button
        :disabled="saving"
        variant="primary"
        @click="saveSettings"
      >
        <b-spinner small v-if="saving" />
        <span v-else>Save and reload browser</span>
      </b-button>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      saving: false,
      languages: [
        { flag: '🇺🇸', code: 'en' },
        { flag: '🇪🇸', code: 'es' },
        { flag: '🇵🇱', code: 'pl' },
        { flag: '🇩🇪', code: 'de' },
        { flag: '🇦🇪', code: 'ar' },
        { flag: '🇫🇷', code: 'fr' },
        { flag: '🇯🇵', code: 'ja' },
        { flag: '🇮🇹', code: 'it' },
        { flag: '🇨🇿', code: 'cs' },
      ],
      language: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.language = settings.language || 'en';
  },

  methods: {
    saveSettings() {
      const { language, settings } = this;

      const payload = {
        ...settings,
        language,
      };

      this.$store.dispatch('SAVE_SETTINGS', payload)
        .then(() => {
          this.$bvToast.toast('Settings saved', { title: 'Success', variant: 'success' });
          location.reload();
        })
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
          this.saving = false;
        });
    },
  },
};
</script>
