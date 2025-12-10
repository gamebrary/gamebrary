<template>
  <div :class="['tile', size]">
    <section :class="['p-3 rounded my-3 m-3', darkTheme ? 'bg-dark text-light' : 'bg-light']">
      <h3 class="mb-2">{{ title }}</h3>

      <div :class="['content', 'rounded', size]">
        <slot />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppGetters } from '@/stores/getters';

const props = defineProps({
  size: {
    type: String,
    default: 'full',
  },
  title: String,
});

const { darkTheme } = useAppGetters();
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tile {
  &.half {
    width: 50vw;
    height: 50vh;
    overflow: hidden !important;

    @media (max-width: $bp-md) {
      width: auto;
      overflow: auto !important;
    }
  }

  &.quarter {
    width: 25vw;
    height: 25vh;

    @media (max-width: $bp-md) {
      width: auto;
      overflow: auto !important;
    }
  }
}

.content {
  &.half {
    height: calc(50vh - 94px);
    overflow: auto;
  }

  &.quarter {
    height: calc(25vh - 94px);
    overflow: auto;
  }
}

// .full {
//   width: 100vw;
//   overflow: auto !important;
// }
//
// .half {
//   height: calc(50vh - 94px);
//   overflow: auto;
// }
//
// .quarter {
//   height: calc(50vh - 94px);
//   overflow: auto;
// }
</style>
