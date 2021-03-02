<!-- TODO: create profile modal -->
<!-- TODO: load profile on initial load -->
<!-- TODO: Profile in settings  -->
<!-- TODO: Profile public page -->
<template lang="html">
  <div>
    <b-button v-b-modal.edit-profile>
      Edit
    </b-button>

    <edit-profile-modal />
  </div>
</template>

<script>
import EditProfileModal from '@/components/EditProfileModal';
import { mapGetters } from 'vuex';

export default {
  components: {
    EditProfileModal,
  },

  computed: {
    ...mapGetters(['darkTheme']),
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