<template lang="html">
  <div>
    <pre>{{ userName }}</pre>
    <b-alert show variant="danger" v-if="error">
      user not found
    </b-alert>

    <pre class="bg-info">{{ profile }}</pre>
    <!-- TODO: load profile and display it -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: false,
      profile: null,
    };
  },
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
      this.$store.dispatch('LOAD_PUBLIC_PROFILE', this.userName)
        .then((data) => {
          this.profile = data;
        })
        .catch(() => {
          this.error = true;
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

