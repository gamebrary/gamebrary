<template lang="html">
  <div class="releases-placeholder">
    <div
      v-for="n in 3"
      :key="n"
      class="release"
    >
      <div class="release-info">
        <b-button
          class="link info small"
          disabled
        />

        <placeholder :lines="2" />
      </div>

      <placeholder :lines="3" />
    </div>
  </div>
</template>

<script>
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    Placeholder,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// @import "~styles/styles";

.release {
  border-bottom: 1px solid #e5e5e5;
  margin: 1rem 0;
  padding-bottom: .5rem;
}

.release-info {
  display: grid;
  grid-template-columns: 50px 30%;
  grid-gap: 1rem;
}
</style>
