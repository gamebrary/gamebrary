<template lang="html">
  <b-container class="pt-2">
    <h2>{{ $t('tags.title') }}</h2>
    <p>{{ $t('tags.subtitle') }}</p>
    <h1>Settings</h1>

    <b-button
      variant="link"
      :title="$t('navMenu.wallpapers')"
      :to="{ name: 'wallpapers' }"
      v-b-tooltip.hover.right
    >
      <icon name="image" />
    </b-button>

    <b-button
      variant="link"
      :title="$t('navMenu.language')"
      :to="{ name: 'language' }"
      v-b-tooltip.hover.right
    >
      <icon name="globe" />
    </b-button>

    <b-button
      variant="link"
      :title="$t('navMenu.theme')"
      v-b-tooltip.hover.right
      @click="toggleTheme"
    >
      <icon :name="nightMode ? 'moon' : 'sun'" />
    </b-button>

    <b-button
      variant="link"
      :title="$t('navMenu.releases')"
      :to="{ name: 'releases' }"
      v-b-tooltip.hover.right
    >
      <icon name="megaphone" />
    </b-button>

    <b-button
      variant="link"
      :title="$t('navMenu.about')"
      :to="{ name: 'about' }"
      v-b-tooltip.hover.right
    >
      <icon name="info" />
    </b-button>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nightMode']),
  },

  methods: {
    toggleTheme() {
      this.$store.commit('UPDATE_SETTING', { key: 'nightMode', value: !this.nightMode });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
