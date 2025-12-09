<template lang="html">
  <AppSidebar
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
            :placeholder="t('tags.form.inputPlaceholder')"
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
  </AppSidebar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import AppSidebar from '@/components/AppSidebar';
import SidebarHeader from '@/components/SidebarHeader';

const store = useStore();
const { t } = useI18n();

// Reactive state
const tag = ref({
  name: '',
  textColor: '#DDE6E8',
  bgColor: '#1FBC9C',
  games: [],
});
const saving = ref(false);

// Store state and getters
const tags = computed(() => store.state.tags);
const sidebarRightProps = computed(() => store.getters.sidebarRightProps);
const darkTheme = computed(() => store.getters.darkTheme);

// Computed properties
const visible = computed(() => {
  // Control visibility via store or prop - adjust based on your needs
  return store.state.activeTagIndex !== null || false;
});

// Methods
const hideSidebar = () => {
  const element = document.getElementById('create-tag-sidebar');
  if (element) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(element);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }
};

const handleHidden = () => {
  saving.value = false;
};

const submit = async () => {
  store.commit('CREATE_TAG', tag.value);
  saving.value = true;

  try {
    await store.dispatch('SAVE_TAGS');
    hideSidebar();
    // Reset form
    tag.value = {
      name: '',
      textColor: '#DDE6E8',
      bgColor: '#1FBC9C',
      games: [],
    };
  } catch (e) {
    // Error handling
  } finally {
    saving.value = false;
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
