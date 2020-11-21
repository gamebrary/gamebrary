<template lang="html">
  <b-container class="pt-2">
    <h2>{{ $t('languages.title') }}</h2>

    <b-form-select v-model="language" class="mb-2 w-50">
      <b-form-select-option
        v-for="{ name, value } in SUPPORTED_LANGUAGES"
        :key="value"
        :value="value"
      >
        {{ name }}
      </b-form-select-option>
    </b-form-select>

    <br>

    <b-button
      :disabled="saving"
      variant="primary"
      @click="saveSettings"
    >
      <b-spinner small v-if="saving" />
      <span v-else>{{ $t('languages.save') }}</span>
    </b-button>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
    ...mapGetters(['nightMode']),
  },

  mounted() {
    const { settings } = this;

    this.language = settings && settings.language
      ? settings.language
      : 'en';
  },

  methods: {
    saveSettings() {
      const { language, settings } = this;

      const payload = {
        ...settings,
        language,
      };

      // TODO: Make async
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
