<template lang="html">
  <b-container class="pt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">
        <b-button
          size="sm"
          :variant="nightMode ? 'dark' : 'light'"
          @click="$router.push({ name: 'settings' })"
        >
          <i class="fas fa-chevron-circle-left fa-fw" aria-hidden />
        </b-button>

        Language
      </h3>
    </div>

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
