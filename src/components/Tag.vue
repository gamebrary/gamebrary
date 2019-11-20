<template lang="html">
  <span
    v-if="label && hex"
    :style="`background-color: ${hex}; color: ${textHex}`"
    :class="['tag', { readonly }]"
  >
    <i
      v-if="!readonly"
      class="fas fa-times close"
      @click="close"
    />

    <span @click="action">
      {{ label }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    hex: {
      type: String,
      default: '',
    },
    textHex: {
      type: String,
      default: '#000',
    },
  },

  methods: {
    action() {
      this.$emit('action');
    },

    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .tag {
    border-radius: 100px;
    box-shadow: 0 0px 1px #a5a2a2;
    padding: 0 $gp / 2 0 2px;
    min-height: 18px;
    font-size: $font-size-xsmall;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #555555;
    cursor: pointer;
    margin: 0 2px 2px 0;

    &.readonly {
      padding: 0 $gp / 2;
    }

    &.light { color: #fff; }
    &.dark { color: #fff; }
  }

  .close {
    height: 14px;
    width: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    margin-right: 4px;
  }

  .light .close,
  .dark .close {
    &:hover {
      color: var(--danger-text-color);
      background-color: var(--danger-background);
    }
  }

  .light .close {
    background-color: rgba(85, 85, 85, .5);
  }

  .dark .close {
    background-color: rgba(229, 229, 229, .5);
  }
</style>
