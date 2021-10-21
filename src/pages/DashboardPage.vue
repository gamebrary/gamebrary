<template lang="html">
  <b-container fluid>
    <page-title
      title="Boards"
      action-text="Create board"
      @action="$bvModal.show('create-board')"
    />
    moar stuff here
    - profiles
    - news
      - Gather all news available and create custom object
    - releases / gamebrary news
    - Developer info. repo, free

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
