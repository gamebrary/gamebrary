<template lang="html">
  <div class="d-flex align-items-center justify-content-between p-3">
    <h2 v-if="title">{{ title }}</h2>
    <slot />

    <button
      type="button"
      class="btn"
      :class="darkTheme ? 'btn-dark' : 'btn-light'"
      @click="$emit('hide')"
    >
      <i class="fa-solid fa-xmark" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppGetters } from '@/stores/getters';

defineProps({
  title: String,
});

defineEmits(['hide']);

const { darkTheme } = useAppGetters();
</script>
