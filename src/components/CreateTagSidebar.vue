<template lang="html">
  <Sidebar
    id="create-tag-sidebar"
    :visible="visible"
    :placement="'end'"
    :no-header="true"
    v-bind="sidebarRightProps"
    @hidden="handleHidden"
  >
    <SidebarHeader @hide="hideSidebar" title="Create tag" />

      <form @submit.prevent="submit" class="p-3">
        <div class="d-flex">
          <input
            id="tagName"
            type="text"
            v-model.trim="tag.name"
            class="form-control me-2"
            maxlength="20"
            :placeholder="$t('tags.form.inputPlaceholder')"
            required
          />

          <input
            type="color"
            v-model="tag.bgColor"
            class="form-control form-control-color me-2"
            style="width: 40px; height: 40px; cursor: pointer;"
            title="Tag background color"
          />

          <input
            type="color"
            v-model="tag.textColor"
            class="form-control form-control-color"
            style="width: 40px; height: 40px; cursor: pointer;"
            title="Tag text color"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary mt-3"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>Create</span>
        </button>
      </form>
  </Sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar';
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
    Sidebar,
    SidebarHeader,
  },

  computed: {
    ...mapState(['tags']),
    ...mapGetters(['sidebarRightProps', 'darkTheme']),

    visible() {
      // Control visibility via store or prop - adjust based on your needs
      return this.$store.state.activeTagIndex !== null || false;
    },
  },

  methods: {
    hideSidebar() {
      const element = document.getElementById('create-tag-sidebar');
      if (element) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(element);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
    },

    handleHidden() {
      this.saving = false;
    },

    async submit() {
      this.$store.commit('CREATE_TAG', this.tag);
      this.saving = true;

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {});

      this.saving = false;
      this.hideSidebar();
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
