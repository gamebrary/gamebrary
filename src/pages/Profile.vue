<!-- TODO: create profile modal -->
<!-- TODO: load profile on initial load -->
<!-- TODO: Profile in settings  -->
<!-- TODO: Profile public page -->
<template lang="html">
  <b-container>
    <empty-state
      title="Profiles"
      message="Share boards with other users, get your own shareable URL, and more!"
      action-text="Create profile"
      @action="createProfile"
    >
    </empty-state>

    <b-button :to="{ name: 'edit-profile' }">
      Edit
    </b-button>

    <div>
      <b-alert show variant="warning">
        Profiles are public. Boards can be public or private.
      </b-alert>

      create form here
    </div>

    <!-- <p><b-badge>{{ profile.followers.length }}</b-badge> Followers</p> -->
    <!-- <p><b-badge>{{ profile.following.length }}</b-badge> Followers</p> -->

    <!-- <a :href="profile.website" target="_blank">Website</a> -->

    <!-- <b-button :href="profile.twitter" target="_blank">
      <i class="fab fa-twitter fa-fw" aria-hidden />
    </b-button>
    <pre>{{ profile }}</pre> -->
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
    ...mapState(['profile', 'boards']),
  },

  methods: {
    createProfile() {
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
