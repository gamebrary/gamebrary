<template lang="html">
  <section>
    <h3>General</h3>

    <div class="setting">
      <i class="fas fa-language" />
      <h5>{{ $t('settings.language') }}</h5>

      <b-form-select v-model="value.language">
        <b-form-select-option value="en">🇺🇸 {{ $t('settings.languages.en') }}</b-form-select-option>
        <b-form-select-option value="es">🇪🇸 {{ $t('settings.languages.es') }}</b-form-select-option>
        <b-form-select-option value="pl">🇵🇱 {{ $t('settings.languages.pl') }}</b-form-select-option>
        <b-form-select-option value="de">🇩🇪 {{ $t('settings.languages.de') }}</b-form-select-option>
        <b-form-select-option value="ar">🇦🇪 {{ $t('settings.languages.ar') }}</b-form-select-option>
        <b-form-select-option value="fr">🇫🇷 {{ $t('settings.languages.fr') }}</b-form-select-option>
        <b-form-select-option value="ja">🇯🇵 {{ $t('settings.languages.ja') }}</b-form-select-option>
        <b-form-select-option value="it">🇮🇹 {{ $t('settings.languages.it') }}</b-form-select-option>
        <b-form-select-option value="eu">🏴 {{ $t('settings.languages.eu') }}</b-form-select-option>
        <b-form-select-option value="cs">🇨🇿 {{ $t('settings.languages.cs') }}</b-form-select-option>
      </b-form-select>
    </div>
    <small>Browser reload required</small>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// @import "~styles/styles";

.reloading {
  width: 100%;
  text-align: center;
}

select {
  margin: 0;
}
</style>
