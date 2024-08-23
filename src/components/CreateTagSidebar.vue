<template lang="html">
  <b-sidebar
    id="create-tag-sidebar"
    scrollable
    right
    shadow
    no-header
    backdrop
    body-class="p-3"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
  >
    <!-- TODO: hook up shown and close, reset stuff as needed -->
    <!-- @shown="load"
    @hidden="closeSidebar" -->
    <template #default="{ hide }">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h2>
          Create tag
        </h2>

        <b-button
          @click="hide"
        >
          <i class="fa-solid fa-xmark" />
        </b-button>
      </div>

      <form @submit.prevent="submit">
        <b-form-input
          v-model.trim="tag.name"
          class="mb-3"
          maxlength="20"
          :placeholder="$t('tags.form.inputPlaceholder')"
          required
          trim
        />

        <div class="tag-colors">
          <div>
            <p>Background color</p>
            <v-swatches v-model="tag.bgColor" show-fallback />
          </div>

          <div>
            <p>Text color</p>
            <v-swatches v-model="tag.textColor" show-fallback />
          </div>
        </div>

        <b-button
          variant="primary"
          :disabled="saving"
          type="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Create</span>
        </b-button>
      </form>
    </template>
  </b-sidebar>
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

      this.saving = false;
      this.$root.$emit('bv::toggle::collapse', 'create-tag-sidebar');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
