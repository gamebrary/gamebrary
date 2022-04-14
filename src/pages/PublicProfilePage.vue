<template lang="html">
  <b-container fluid>
    <div v-if="loading">
      Loading...
    </div>

    <template v-else-if="profile">
      <div>
        <img
          v-if="avatar"
          :src="avatar"
          :alt="userName"
          class="rounded"
        />

        <h2>{{ profile.userName }}</h2>

        <p>{{ profile.bio }}</p>
        <p>{{ profile.friendCode }}</p>

        <a :href="profile.twitter" v-if="profile.twitter">
          <i class="fab fa-twitter fa-fw" aria-hidden />
        </a>

        <p class="text-info">
          <i class="fas fa-map-marker fa-fw" aria-hidden />
          {{ profile.location }}</p>
        <p>{{ profile }}</p>
      </div>

      <b-button v-if="canEdit" :to="{ name: 'profile' }">
        Edit
      </b-button>

      <b-button :to="{ name: 'profiles' }">
        View other profiles
      </b-button>

      <mini-board
        v-for="board in userBoards"
        :key="board.id"
        :board="board"
        @view-board="viewPublicBoard(board.id)"
        class="p-relative"
      />
    </template>

    <empty-state
      v-else
      title="404 Not Found"
      message="Page not found!"
    />
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    MiniBoard,
    EmptyState,
  },

  data() {
    return {
      error: false,
      loading: false,
      userBoards: [],
      profile: null,
    };
  },

  computed: {
    ...mapState(['user']),

    canEdit() {
      return this.user?.uid === this.profile?.uid;
    },

    userName() {
      return this.$route.params.userName;
    },

    avatar() {
      return this.profile?.profilePic || this.user?.photoURL || null;
    },
  },

  watch: {
    userName(value) {
      if (value) {
        this.loadProfile();
      }
    },
  },

  mounted() {
    this.loadProfile();
  },

  methods: {
    viewPublicBoard(id) {
      this.$router.push({ name: 'public-board', params: { id } });
    },

    async loadProfile() {
      this.error = false;
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PUBLIC_PROFILE', this.userName)
        .catch(() => {
          this.error = true;
        });

      if (!this.profile) {
        this.loading = false;

        return;
      }

      this.userBoards = await this.$store.dispatch('LOAD_USER_PUBLIC_BOARDS', this.profile.uid)
        .catch(() => {
          this.error = true;
        });

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

