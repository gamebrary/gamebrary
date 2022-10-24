<template lang="html">
  <section>
    <b-container>
      <b-row>
        <b-col>
          <div class="d-flex align-items-center justify-content-between mb-2 pt-2">
            Recent boards

            <div>
              <b-button
                class="mr-2"
                size="sm"
                :to="{ name: 'create.board' }"
              >
                <i class="fa fa-plus" aria-hidden="true" />
              </b-button>

              <b-button
                v-if="sortedBoards.length > 10"
                size="sm"
                title="Boards"
                :to="{ name: 'boards' }"
              >
                View all boards
              </b-button>
            </div>
          </div>

          <b-form-row>
            <b-col
              v-for="board in recentBoards"
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
          </b-form-row>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col cols="12" sm="6" md="3">
          <settings-card
            title="Wallpapers"
            description="Manage your wallpapers"
            icon="fa-images"
            @click.native="$router.push({ name: 'wallpapers' })"
          />
        </b-col>
        <b-col cols="12" sm="6" md="3">
          <settings-card
            title="Notes"
            description="View all your notes"
            icon="fa-note-sticky"
            @click.native="$router.push({ name: 'notes' })"
          />
        </b-col>

        <b-col cols="12" sm="6" md="3">
          <settings-card
            title="Tags"
            description="Manage your tags"
            icon="fa-tags"
            @click.native="$router.push({ name: 'tags' })"
          />
        </b-col>

        <b-col cols="12" sm="6" md="3">
          <settings-card @click.native="$router.push({ name: 'account' })">
            <b-avatar
              rounded
              v-if="avatarImage"
              :src="avatarImage"
              v-b-tooltip.hover
              :title="`@${profile.userName}`"
            />

            <i
              v-else
              class="fa-2x fa-solid fa-user fa-fw"
              aria-hidden
            />


            <aside>
              <h4 class="mb-0 strong">Account</h4>
              <small class="text-muted">
                <b-link
                  v-if="profile.userName"
                  :to="{ name: 'public.profile', params: { userName: profile.userName } }"
                >
                  @{{ profile.userName }}
                </b-link>

                <template v-else>
                  Manage your account, create your profile.
                </template>
              </small>
            </aside>
          </settings-card>
        </b-col>
      </b-row>

      <!-- <div
        data-form-slug="6148881969433360"
        data-env="production"
        data-path="contact-us/6148881969433360"
        class="keap-custom-form"
      /> -->

      <footer class="d-flex justify-content-between">
        <div class="footer-links">
          <b-button
            variant="transparent"
            size="sm"
            v-b-modal.keyboard-shortcuts
            v-b-tooltip.hover
            title="Keyboard shortcuts"
          >
            <i class="fa-solid fa-keyboard fa-fw" />
          </b-button>

          <b-button
            href="https://github.com/romancm/gamebrary"
            target="_blank"
            size="sm"
            v-b-tooltip.hover
            title="Gamebrary on GitHub"
            variant="transparent"
          >
            <i class="fab fa-github fa-fw" />
          </b-button>

          <b-button
            variant="transparent"
            href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
            target="_blank"
            title="Submit feedback"
            v-b-tooltip.hover
          >
            <i class="fa-regular fa-comment-dots fa-fw" />
          </b-button>

          <b-button
            href="https://www.paypal.me/RomanCervantes/5"
            target="_blank"
            size="sm"
            variant="transparent"
            v-b-tooltip.hover
            title="Donate"
          >
            <i class="fa-solid fa-circle-dollar-to-slot fa-fw" />
          </b-button>


          <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'steam.settings' }">
            <i class="mr-2 fab fa-steam fa-fw" aria-hidde fa-fwn />
            <small>Steam</small>
          </b-list-group-item> -->
        </div>

        <div>
          <small>&copy; 2022 Gamebrary</small>

          <b-link
            :to="{ name: 'releases' }"
            class="px-1 text-dark"
          >
            <small>{{ latestRelease }}</small>
          </b-link>
        </div>
      </footer>
    </b-container>
  </section>
</template>

<script>
// import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import SettingsCard from '@/components/Settings/SettingsCard';
import MiniBoard from '@/components/Board/MiniBoard';
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings';
import { getImageThumbnail } from '@/utils';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    // LanguageSettings,
    // ProfileSettingsPage,
    SettingsCard,
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
    ...mapState(['user', 'releases', 'tags']),
    ...mapGetters(['sortedBoards']),

    latestRelease() {
      return this.releases?.[0]?.tag_name;
    },
  },

  methods: {
    async load() {
      await this.$store.dispatch('LOAD_BOARDS');
      await this.$store.dispatch('LOAD_TAGS');

      this.recentBoards = this.sortedBoards.slice(0, 8);

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
