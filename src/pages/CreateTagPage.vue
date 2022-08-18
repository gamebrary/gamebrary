<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          variant="light"
          class="mr-2"
          :to="{ name: 'tags' }"
        >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Create tag
      </div>
    </portal>

    <form @submit.prevent="submit">
      <b-form-input
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

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {});

      this.saving = true;
      this.$router.push({ name: 'tags' })
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
