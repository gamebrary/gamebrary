<template lang="html">
  <b-container>
    <b-spinner v-if="loading" class="spinner-centered" />

    <div
      v-else-if="profile"
    >
      <portal to="headerActions">
        <b-button
          v-if="isProfileOwner"
          class="mr-2"
          :to="{ name: 'profile.settings' }"
        >
          Edit
        </b-button>
      </portal>
      <div class="profile field centered text-center">
        <b-avatar
          src="https://placekitten.com/300/300"
          size="6rem"
          class="mb-2"
        />

        <!-- <pre>{{ profile }}</pre> -->
        <h1 class="m-0">{{ profile.userName }}</h1>
        <p class="text-lead text-muted m-0">{{ profile.name }}</p>
        <p>{{ profile.bio }}</p>

        <p>
          <i class="fa fa-globe" aria-hidden="true" />
          {{ profile.location }}
        </p>

        <b-button :href="profile.twitter" v-if="profile.twitter" class="mr-2">
          <i class="fab fa-twitter fa-fw" aria-hidden />
          {{ profile.twitter }}
        </b-button>

        <b-button v-if="profile.website" :href="profile.website">
          {{ profile.website }}
        </b-button>

      </div>

      <!-- <b-button :to="{ name: 'profiles' }">
        View other profiles
      </b-button> -->
      <b-row class="mt-4">
        <b-col
          v-for="board in userBoards"
          :key="board.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="px-2"
        >
          <mini-board
            :board="board"
            @click.native="$router.push({ name: 'board', params: { id: board.id } })"
            class="p-relative mb-3"
          />
        </b-col>
      </b-row>
    </div>

    <empty-state
      v-else
      title="404 Not Found"
      illustration="404.png"
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

    userName() {
      return this.$route.params.userName;
    },

    isProfileOwner() {
      if (!this.user?.uid) return false;

      return this.user?.uid === this.profile?.uid;
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
      this.$router.push({ name: 'public.board', params: { id } });
    },

    async loadProfile() {
      this.error = false;
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PUBLIC_PROFILE_BY_USERNAME', this.userName)
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

