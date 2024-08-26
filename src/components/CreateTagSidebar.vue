<template lang="html">
  <b-sidebar
    id="create-tag-sidebar"
    v-bind="sidebarProps"
    right
    @hidden="saving = false"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide">
        Create tag
      </SidebarHeader>

      <form @submit.prevent="submit" class="p-3">
        <div class="d-flex">
          <b-form-input
            id="tagName"
            v-model.trim="tag.name"
            class="mr-2"
            maxlength="20"
            :placeholder="$t('tags.form.inputPlaceholder')"
            required
            trim
          />

          <v-swatches
            v-model="tag.bgColor"
            v-b-tooltip.hover
            class="mr-2"
            title="Tag background color"
            :trigger-style="{ height: '40px', width: '40px', border: '1px solid #ced4da' }"
            show-fallback
            show-checkbox
            fallback-input-class="color-input float-left"
            fallback-input-type="color"
            :fallback-ok-class="`${darkTheme ? 'bg-secondary text-light' : 'bg-light text-dark'} p-2 float-right`"
            fallback-ok-text="Select"
            popover-x="left"
          />

          <v-swatches
            v-model="tag.textColor"
            v-b-tooltip.hover
            title="Tag text color"
            :trigger-style="{ height: '40px', width: '40px', border: '1px solid #ced4da' }"
            show-fallback
            show-checkbox
            fallback-input-class="color-input float-left"
            fallback-input-type="color"
            :fallback-ok-class="`${darkTheme ? 'bg-secondary text-light' : 'bg-light text-dark'} p-2 float-right`"
            fallback-ok-text="Select"
            popover-x="left"
          />
        </div>

        <b-button
          class="mt-3"
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
import SidebarHeader from '@/components/SidebarHeader';

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
    SidebarHeader,
  },

  computed: {
    ...mapState(['tags']),
    ...mapGetters(['sidebarProps', 'darkTheme']),
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
