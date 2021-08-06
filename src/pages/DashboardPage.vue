<template lang="html">
  <b-container fluid>
    Dashboard
    <page-title
      title="Boards"
      action-text="Create board"
      @action="$bvModal.show('create-board')"
    />

    <boards />

    <h5>public boards</h5>
    <h5>news feeds</h5>
    <h5>deals</h5>
    <h5>newsletter signup</h5>
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
