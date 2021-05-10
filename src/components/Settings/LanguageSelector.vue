<template lang="html">
  <b-form-group label="Language">
    <b-form-select
      v-model="language"
      style="max-width: 200px"
      @change="saveLanguage"
    >
      <b-form-select-option
        v-for="{ name, value } in SUPPORTED_LANGUAGES"
        :key="value"
        :value="value"
      >
        {{ name }}
      </b-form-select-option>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { mapState } from 'vuex';
import { SUPPORTED_LANGUAGES } from '@/constants';

export default {
  data() {
    return {
      saving: false,
      SUPPORTED_LANGUAGES,
      language: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.language = settings && settings.language
      ? settings.language
      : 'en';
  },

  methods: {
    async saveLanguage() {
      const { language, settings } = this;
      this.$i18n.locale = language;

      const payload = {
        ...settings,
        language,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },
  },
};
</script>
