<template lang="html">
  <header :class="['align-items-start', { 'has-action': slotKeys.includes('default') }]">
    <div>
      <slot name="header" v-if="slotKeys.includes('header')" />
      <h3 class="text-wrap">{{ title }}</h3>
      <small class="d-block text-muted" style="margin-top: -4px;">{{ subtitle }}</small>
    </div>

    <div class="actions" v-if="slotKeys.includes('default')">
      <slot />
    </div>

    <button type="button" class="btn" :class="darkTheme ? 'btn-dark' : 'btn-light'" @click="$emit('close')">
      <PhX :size="16" weight="fill" aria-hidden />
    </button>
  </header>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useAppGetters } from '@/stores/getters';
import { PhX } from '@phosphor-icons/vue';

const props = defineProps({
  title: String,
  subtitle: String,
});

defineEmits(['close']);

const slots = useSlots();
const { darkTheme } = useAppGetters();

const slotKeys = computed(() => Object.keys(slots));
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
header {
  display: grid;
  width: 100%;
  align-items: center;
  grid-template-columns: auto 46px;
  grid-gap: .5rem;

  &.has-action {
    grid-template-columns: 1fr auto 46px;
  }
}

h5 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  margin-left: auto;
  align-self: flex-start;
}
</style>
