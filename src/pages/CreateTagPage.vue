<template lang="html">
  <b-container fluid>
    <portal to="pageTitle">
      Create tag
    </portal>

    <form @submit.prevent="submit">
      <label for="tagName">Tag name:</label>
      <b-form-input
        id="tagName"
        v-model.trim="tag.name"
        class="mb-3 field"
        maxlength="20"
        :placeholder="$t('tags.form.inputPlaceholder')"
        required
        trim
      />

      <p>Background color</p>
      <v-swatches v-model="tag.bgColor" show-fallback />

      <p>Text color</p>
      <v-swatches v-model="tag.textColor" show-fallback />

      <p>Preview</p>

      <b-button
        rounded
        block
        size="sm"
        class="mr-2 mb-2 field"
        variant="outline-light"
        :style="`background-color: ${tag.bgColor}; color: ${tag.textColor}`"
      >
        {{ tag.name || 'Tag preview' }}
      </b-button>

      <b-button
        variant="primary"
        :disabled="saving"
        type="submit"
      >
        <b-spinner small v-if="saving" />
        <span v-else>Create</span>
      </b-button>
    </form>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import VSwatches from 'vue-swatches'

export default {
  data() {
    return {
      tag: {
        name: '',
        textColor: '#DDE6E8',
        bgColor: '#1FBC9C',
        games: [],
      },
      saving: false,
    }
  },

  components: {
    VSwatches,
  },

  computed: {
    ...mapState(['tags']),
  },

  methods: {
    async submit() {
      this.$store.commit('CREATE_TAG', this.tag);
      this.saving = true;

      await this.$store.dispatch('SAVE_GAME_TAGS')
        .catch(() => {});

      this.saving = true;
      this.$router.push({ name: 'tags' })
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
