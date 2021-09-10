<template lang="html">
  <b-container fluid>
    <page-title
      title="Boards"
      action-text="Create board"
      @action="$bvModal.show('create-board')"
    />

    <boards />
  </b-container>
</template>

<script>
import Boards from '@/components/Boards';


export default {
  components: {
    Boards,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
