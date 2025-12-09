<template>
  <div>
    <div
      ref="offcanvas"
      class="offcanvas"
      :class="[
        placement === 'right' || placement === 'end' ? 'offcanvas-end' : 'offcanvas-start',
        { 'show': visible && !useBootstrapJS }
      ]"
      :id="id"
      tabindex="-1"
      :aria-labelledby="`${id}Label`"
      :style="visible && !useBootstrapJS ? { visibility: 'visible', display: 'block' } : {}"
      :data-bs-scroll="scrollable"
      :data-bs-backdrop="backdrop"
    >
      <div class="offcanvas-header" v-if="showHeader && !noHeader">
        <h5 class="offcanvas-title" :id="`${id}Label`">
          <slot name="header">{{ title }}</slot>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          @click="handleClose"
        ></button>
      </div>
      <div class="offcanvas-body" :class="{ 'p-0': noHeader }">
        <slot />
      </div>
      <div class="offcanvas-footer" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
    <div
      v-if="visible && backdrop"
      class="offcanvas-backdrop fade show"
      @click="handleClose"
      :style="{ zIndex: zIndex - 1 }"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

defineOptions({
  name: 'AppSidebar',
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  noHeader: {
    type: Boolean,
    default: false,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
  backdrop: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: 'start', // 'start' or 'end'
  },
  bgVariant: {
    type: String,
    default: null,
  },
  textVariant: {
    type: String,
    default: null,
  },
  zIndex: {
    type: Number,
    default: 1045,
  },
});

const emit = defineEmits(['update:visible', 'hidden', 'shown']);

// Template refs
const offcanvas = ref(null);

// Reactive state
const useBootstrapJS = ref(true);
const bsOffcanvas = ref(null);

// Methods
const show = () => {
  const element = offcanvas.value;
  if (element && useBootstrapJS.value) {
    if (!bsOffcanvas.value) {
      bsOffcanvas.value = new bootstrap.Offcanvas(element, {
        backdrop: props.backdrop,
        keyboard: true,
        scroll: props.scrollable,
      });
    }
    bsOffcanvas.value.show();
    element.addEventListener('hidden.bs.offcanvas', handleHidden, { once: true });
    element.addEventListener('shown.bs.offcanvas', handleShown, { once: true });
  }
};

const hide = () => {
  if (bsOffcanvas.value) {
    bsOffcanvas.value.hide();
  }
};

const handleClose = () => {
  emit('update:visible', false);
  emit('hidden');
};

const handleHidden = () => {
  emit('update:visible', false);
  emit('hidden');
};

const handleShown = () => {
  emit('shown');
};

// Watchers
watch(() => props.visible, (newVal) => {
  if (useBootstrapJS.value) {
    if (newVal) {
      show();
    } else {
      hide();
    }
  }
});

// Lifecycle hooks
onMounted(() => {
  if (props.visible && useBootstrapJS.value) {
    nextTick(() => {
      show();
    });
  }
  // Apply bg/text variants
  if (props.bgVariant || props.textVariant) {
    const element = offcanvas.value;
    if (element) {
      if (props.bgVariant) {
        element.classList.add(`bg-${props.bgVariant}`);
      }
      if (props.textVariant) {
        element.classList.add(`text-${props.textVariant}`);
      }
    }
  }
});

onBeforeUnmount(() => {
  if (bsOffcanvas.value) {
    bsOffcanvas.value.dispose();
  }
});
</script>

<style scoped>
.offcanvas {
  z-index: 1045;
}

.offcanvas-backdrop {
  z-index: 1040;
}
</style>
