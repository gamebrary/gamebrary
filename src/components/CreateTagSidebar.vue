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
import { useTagsStore } from '@/stores/tags';
import { useUIStore } from '@/stores/ui';
import { useAppGetters } from '@/stores/getters';
import { useI18n } from 'vue-i18n';
import AppSidebar from '@/components/AppSidebar';
import SidebarHeader from '@/components/SidebarHeader';

const tagsStore = useTagsStore();
const uiStore = useUIStore();
const { sidebarRightProps, darkTheme } = useAppGetters();
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
const tags = computed(() => tagsStore.tags);

// Computed properties
const visible = computed(() => {
  return uiStore.activeTagIndex !== null || false;
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
  tagsStore.createTag(tag.value);
  saving.value = true;

  try {
    const { useUserStore } = await import('@/stores/user');
    const userStore = useUserStore();
    await tagsStore.saveTags(userStore.user.uid);
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
