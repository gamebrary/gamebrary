<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        Recent boards
      </portal>

      <portal to="headerActions">
        <div class="d-none d-sm-flex">
          <b-button
            class="mr-2"
            :to="{ name: 'create.board' }"
          >
            <i class="fa fa-plus" aria-hidden="true" />
          </b-button>

          <b-button
            v-if="sortedBoards.length > 10"
            title="Boards"
            class="mr-2"
            :to="{ name: 'boards' }"
          >
            View all
          </b-button>
        </div>
      </portal>

      <b-row>
        <b-col>
          <b-form-row class="boards scrollbox">
            <b-col
              v-for="board in sortedBoards"
              :key="board.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <mini-board
                :board="board"
                class="mb-3"
                style="height: 180px"
                @click.native="$router.push({ name: 'board', params: { id: board.id } })"
              />
            </b-col>

            <b-button
              v-if="sortedBoards.length > 10"
              title="Boards"
              block
              class="d-sm-none"
              :to="{ name: 'boards' }"
            >
              View all
            </b-button>
          </b-form-row>
        </b-col>
      </b-row>

      <!-- <div
        data-form-slug="6148881969433360"
        data-env="production"
        data-path="contact-us/6148881969433360"
        class="keap-custom-form"
      /> -->

      <footer class="d-flex align-items-center mt-2 pb-5">
        <b-button
          :to="{ name: 'wallpapers' }"
          class="mr-2">
          <i class="fa fa-images" aria-hidden="true" />
          Wallpapers
        </b-button>

        <b-button :to="{ name: 'notes' }" class="mr-2" id="notes">
          <i class="fa fa-note-sticky" aria-hidden="true" />
          Notes
        </b-button>

        <b-button :to="{ name: 'tags' }" class="mr-2" id="tags">
          <i class="fa fa-tags" aria-hidden="true" />
          Tags
        </b-button>

        <b-button
          :to="{ name: 'account' }"
          v-b-tooltip.hover
          title="Tooltip content"
        >
          <b-avatar
            rounded
            v-if="avatarImage"
            :src="avatarImage"
            v-b-tooltip.hover
            size="22"
            class="mr-1"
            :title="`@${profile.userName}`"
          />

          <i
            v-else
            class="fa fa-solid fa-user"
            aria-hidden
          />

          <b-link
            v-if="profile.userName"
            :to="{ name: 'public.profile', params: { userName: profile.userName } }"
          >
            @{{ profile.userName }}
          </b-link>

          <template v-else>
            Account
          </template>
        </b-button>

        <b-button
          class="ml-2"
          v-b-modal.keyboard-shortcuts
          id="shortcuts"
        >
          <i class="fa-solid fa-keyboard" />
        </b-button>

        <b-button
          class="ml-2"
          href="https://github.com/romancm/gamebrary"
          target="_blank"
          v-b-tooltip.hover
          title="Gamebrary on GitHub"
        >
          <i class="fab fa-github" />
        </b-button>

        <b-button
          class="ml-2"
          href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
          target="_blank"
          title="Submit feedback"
          v-b-tooltip.hover
        >
          <i class="fa-regular fa-comment-dots" />
        </b-button>

        <b-button
          class="ml-2"
          title="Toggle theme"
          @click="toggleTheme"
          v-b-tooltip.hover
        >
          <i v-if="settings.darkTheme" class="fa-solid fa-sun" />
          <i v-else class="fa-solid fa-moon" />
        </b-button>

        <b-button
          class="ml-2"
          href="https://www.paypal.me/RomanCervantes/5"
          target="_blank"
          v-b-tooltip.hover
          title="Donate"
        >
          <i class="fa-solid fa-circle-dollar-to-slot" />
        </b-button>

        <!-- <b-button
          class="ml-2"
          v-b-tooltip.hover
          title="Change language"
        >
          <i class="fa-solid fa-language" />
        </b-button> -->

        <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'steam.settings' }">
          <i class="mr-2 fab fa-steam" aria-hidden />
          <small>Steam</small>
        </b-list-group-item> -->

        <small class="ml-auto">
          &copy; 2022 Gamebrary

          <b-link
            href="https://github.com/romancm/gamebrary/releases"
            target="_blank"
            :class="darkTheme ? 'text-light' : 'text-dark'"
          >
            {{ latestRelease }}
          </b-link>
        </small>
      </footer>
    </b-container>
  </section>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings';
import { getImageThumbnail } from '@/utils';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    // LanguageSettings,
    // SteamSettingsPage,
  },


  data() {
    return {
      popularGames: [115, 125174],
      profile: {},
      recentBoards: [],
      avatarImage: null,
    }
  },

  mounted() {
    // (function(a, b) {
    //   var c = a.keapForms || {
    //       SNIPPET_VERSION: "1.1.0",
    //       appId: "qa317"
    //     },
    //     d = b.createElement("script");
    //   d.type = "text/javascript", d.crossOrigin = "anonymous", d.defer = !0, d.src = "https://forms.keap.app/lib/public-form-embed.js?appId=qa317&version=1.1.0", d.onload = function() {
    //     var b = a.keapForms;
    //     b.renderAllForms ? !b.invoked && (b.invoked = !0, b.renderAllForms()) : console.error("[Keap Forms] Error: could not load")
    //   };
    //   var e = b.getElementsByTagName("script")[0];
    //   e.parentNode.insertBefore(d, e), a.keapForms = c
    // })(window, document);

    this.load();
  },

  computed: {
    ...mapState(['user', 'tags', 'settings']),
    ...mapGetters(['sortedBoards', 'darkTheme', 'latestRelease']),
  },

  methods: {
    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });

    },

    async load() {
      await this.$store.dispatch('LOAD_BOARDS');
      await this.$store.dispatch('LOAD_TAGS');

      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => null);
      if (this.profile?.avatar) this.loadAvatarImage();
    },

    async loadAvatarImage() {
      const thumbnailRef = getImageThumbnail(this.profile?.avatar);

      this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.boards {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>
