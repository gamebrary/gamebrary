<template>
  <div class="board-grid">
    <slot />
  </div>
</template>

<script setup>
// Component accepts default slot and merges classes automatically
</script>

<style lang="scss" scoped>
.board-grid {
  width: 100%;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: $bp-xxl) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: $bp-xl) {
    grid-template-columns: repeat(2, 12fr);
  }

  @media (max-width: $bp-sm) {
    grid-template-columns: repeat(1, 2fr);
  }

  @media (max-width: $bp-xs) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
