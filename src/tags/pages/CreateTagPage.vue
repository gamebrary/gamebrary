<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        <div class="d-flex align-items-center">
          <b-button
            :variant="darkTheme ? 'secondary' : 'light'"
            class="mr-2"
            :to="{ name: 'tags' }"
          >
            <i class="fa-solid fa-chevron-left" />
          </b-button>

          <h3>Create tag</h3>
        </div>
      </portal>

      <form @submit.prevent="submit" class="field centered">
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
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
    ...mapGetters(['darkTheme']),
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
