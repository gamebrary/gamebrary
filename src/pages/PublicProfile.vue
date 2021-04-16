<template lang="html">
  <div>
    <pre>{{ userName }}</pre>
    <!-- TODO: load profile and display it -->
  </div>
</template>

<script>
export default {
  computed: {
    userName() {
      return this.$route.params.userName;
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      // load public profile
      // console.log(this.userName);
      // this.$store.dispatch('LOAD_PROFILE', this.userName)
      //   .then((data) => {
      //     console.log('boom');
      //     console.log(data);
      //   })
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

