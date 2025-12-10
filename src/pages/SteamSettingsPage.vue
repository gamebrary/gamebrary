<template lang="html">
  <section>
    <div class="container">
      <div class="mb-3">
        <label for="steamId" class="form-label">Steam ID:</label>
        <input
          v-model="steamId"
          id="steamId"
          type="text"
          class="form-control"
          style="max-width: 200px"
        />
      </div>

      <button type="button" class="btn btn-primary" @click="save" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span v-else>Save</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';

const settingsStore = useSettingsStore();
const userStore = useUserStore();

const saving = ref(false);
const steamId = ref(null);

const settings = computed(() => settingsStore.settings);

onMounted(() => {
  steamId.value = settings.value?.steamId || null;
});

const save = async () => {
  const payload = {
    ...settings.value,
    steamId: steamId.value,
  };

  saving.value = true;
  try {
    await settingsStore.saveSettings(userStore.user.uid, payload);
  } catch (e) {
    saving.value = false;
  }
  saving.value = false;
};
</script>
