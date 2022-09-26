<template lang="html">
  <b-card>
    <pre>{{ profile }}</pre>
    <b-button

      block
      class="profile-button p-2"

    >

      <div>
        <!-- TODO: put profile card in component -->
        <!-- TODO: show avatar -->
        <b-avatar></b-avatar>
        <h1>{{ profile.displayName }}</h1>
        <small class="text-info">{{ `@${profile.userName}` }}</small>
        <p v-if="profile.bio">{{ profile.bio }}</p>
      </div>
    </b-button>
    <!-- :to="{ name: 'public.profile', params: { userName: profile.userName } }" -->
  </b-card>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
