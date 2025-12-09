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

<script>
export default {
  name: 'AppSidebar',
  props: {
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
  },
  emits: ['update:visible', 'hidden', 'shown'],
  data() {
    return {
      useBootstrapJS: true,
      bsOffcanvas: null,
    };
  },
  watch: {
    visible(newVal) {
      if (this.useBootstrapJS) {
        if (newVal) {
          this.show();
        } else {
          this.hide();
        }
      }
    },
  },
  mounted() {
    if (this.visible && this.useBootstrapJS) {
      this.$nextTick(() => {
        this.show();
      });
    }
    // Apply bg/text variants
    if (this.bgVariant || this.textVariant) {
      const element = this.$refs.offcanvas;
      if (element) {
        if (this.bgVariant) {
          element.classList.add(`bg-${this.bgVariant}`);
        }
        if (this.textVariant) {
          element.classList.add(`text-${this.textVariant}`);
        }
      }
    }
  },
  methods: {
    show() {
      const element = this.$refs.offcanvas;
      if (element && this.useBootstrapJS) {
        if (!this.bsOffcanvas) {
          this.bsOffcanvas = new bootstrap.Offcanvas(element, {
            backdrop: this.backdrop,
            keyboard: true,
            scroll: this.scrollable,
          });
        }
        this.bsOffcanvas.show();
        element.addEventListener('hidden.bs.offcanvas', this.handleHidden, { once: true });
        element.addEventListener('shown.bs.offcanvas', this.handleShown, { once: true });
      }
    },
    hide() {
      if (this.bsOffcanvas) {
        this.bsOffcanvas.hide();
      }
    },
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('hidden');
    },
    handleHidden() {
      this.$emit('update:visible', false);
      this.$emit('hidden');
    },
    handleShown() {
      this.$emit('shown');
    },
  },
  beforeUnmount() {
    if (this.bsOffcanvas) {
      this.bsOffcanvas.dispose();
    }
  },
};
</script>

<style scoped>
.offcanvas {
  z-index: 1045;
}

.offcanvas-backdrop {
  z-index: 1040;
}
</style>
