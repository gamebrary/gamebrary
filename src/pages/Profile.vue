<!-- TODO: create profile modal -->
<!-- TODO: load profile on initial load -->
<!-- TODO: Profile in settings  -->
<!-- TODO: Profile public page -->
<template lang="html">
  <b-container>
    <h1>{{ profile.name }}</h1>
    <p class="lead">{{ profile.bio }}</p>
    <pre>gamebrary.com/{{ profile.userName }}</pre>

    <empty-state
      title="Profile"
      message="Create a public profile now!"
      action-text="Get Started!"
      @action="createProfile"
    />

    <b-button :to="{ name: 'edit-profile' }">
      Edit
    </b-button>

    <!-- <p><b-badge>{{ profile.followers.length }}</b-badge> Followers</p> -->
    <!-- <p><b-badge>{{ profile.following.length }}</b-badge> Followers</p> -->

    <a :href="profile.website" target="_blank">Website</a>

    <b-button :href="profile.twitter" target="_blank">
      <i class="fab fa-twitter fa-fw" aria-hidden />
    </b-button>
    <pre>{{ profile }}</pre>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
  },

  computed: {
    ...mapGetters(['darkTheme']),
    ...mapState(['profile']),
  },

  methods: {
    createProfile() {
      // console.log('boom');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

<!-- {
  userName: '',
  name: '',
  bio: '',
  followers: [],
  following: [],
  dateJoined: [],
  profilePicture: '', // rename?
  backdrop: '', // rename?
  location: '',
  website: '',
  twitter: '',
} -->
