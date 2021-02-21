<template lang="html">
  <b-form-group label="Language">
    <b-form-select v-model="language" class="w-50">
      <b-form-select-option
        v-for="{ name, value } in SUPPORTED_LANGUAGES"
        :key="value"
        :value="value"
      >
        {{ name }}
      </b-form-select-option>
    </b-form-select>

    <b-button
      v-if="settings.language && settings.language !== language"
      variant="primary"
      class="mx-2"
      :disabled="saving"
      @click="saveSettings"
    >
      <b-spinner small v-if="saving" />
      <template v-else>
        <span class="d-none d-sm-inline">{{ $t('languages.save') }}</span>
        <i class="d-sm-none fas fa-sync" aria-hidden />
      </template>
    </b-button>
  </b-form-group>
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
    ...mapGetters(['darkTheme']),
  },

  mounted() {
    const { settings } = this;

    this.language = settings && settings.language
      ? settings.language
      : 'en';
  },

  methods: {
    async saveSettings() {
      const { language, settings } = this;

      const payload = {
        ...settings,
        language,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });

      this.$bvToast.toast('Settings saved');
      location.reload();
    },
  },
};
</script>
