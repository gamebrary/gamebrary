<template lang="html">
  <b-jumbotron
    class="empty-board w-100 text-center"
    :bg-variant="darkTheme ? 'dark' : ''"
    :text-variant="darkTheme ? 'white' : ''"
    :border-variant="darkTheme ? 'light' : ''"
  >
    <p>This board is empty</p>

    <b-button
      :variant="darkTheme ? 'light' : 'primary'"
      @click="openAddListModal"
    >
      Add list
    </b-button>
  </b-jumbotron>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['darkTheme']),
  },

  methods: {
    openAddListModal() {
      this.$bvModal.show('add-list');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.empty-board {
  max-width: 300px;
}
</style>
