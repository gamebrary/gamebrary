<template lang="html">
  <b-container>
    <portal to="pageTitle">Settings</portal>

    <b-row>
      <b-col cols="12">
        <div class="field">
          <settings-card
            title="Wallpapers"
            description="Manage your wallpapers"
            icon="fa-images"
            @click.native="$router.push({ name: 'wallpapers' })"
          />

          <settings-card
            title="Profile"
            description="Public profile"
            icon="fa-user"
            @click.native="$router.push({ name: 'profile.settings' })"
          />

          <settings-card
            title="Notes"
            description="View all your notes"
            icon="fa-note-sticky"
            @click.native="$router.push({ name: 'notes' })"
          />

          <settings-card
            title="Tags"
            description="View all your tags"
            icon="fa-tags"
            @click.native="$router.push({ name: 'tags' })"
          />

          <!-- <div
            data-form-slug="6148881969433360"
            data-env="production"
            data-path="contact-us/6148881969433360"
            class="keap-custom-form"
          /> -->

          <b-button
            block
            variant="light"
            v-b-modal.keyboard-shortcuts
          >
            Keyboard shortcuts
          </b-button>

          <b-button
            block
            variant="light"
            :to="{ name: 'dev.tools' }"
          >
            Dev tools
          </b-button>

          <delete-account-modal />

          <b-button
            href="https://github.com/romancm/gamebrary"
            target="_blank"
            block
            variant="light"
          >
            <!-- <i class="fab fa-github fa-fw" /> -->
            GitHub
          </b-button>

          <b-button
            block
            variant="light"
            href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
            target="_blank"
          >
            Submit feedback
          </b-button>

          <!-- TODO: hide for paid users -->
          <b-button
            block
            variant="outline-primary"
            href="https://www.paypal.me/RomanCervantes/5"
            target="_blank"
          >
            Buy me a coffee
          </b-button>

          <hr />

          <b-button
            block
            variant="light"
            @click="session_signOut"
          >
            Log out
          </b-button>

          <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'steam.settings' }">
            <i class="mr-2 fab fa-steam fa-fw" aria-hidden></i>
            <small>Steam</small>
          </b-list-group-item> -->

          <!-- <hr /> -->

          <!-- <b-list-group-item :to="{ name: 'profiles' }">
            <i class="mr-2 fa-solid fa-people-group fa-fw" aria-hidden />
            <small>Profiles</small>
          </b-list-group-item> -->

          <small>&copy; 2022 Gamebrary</small>

          <b-button
            :to="{ name: 'releases' }"
            size="sm"
            variant="link"
          >
            {{ latestRelease }}
          </b-button>
        </div>
        <!-- <language-settings /> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import SettingsCard from '@/components/Settings/SettingsCard';
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings';
import { mapState } from 'vuex';
import sessionMixin from '@/mixins/sessionMixin';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';

export default {
  components: {
    DeleteAccountModal,
    // LanguageSettings,
    // ProfileSettingsPage,
    SettingsCard,
    // SteamSettingsPage,
  },

  mixins: [sessionMixin],

  mounted() {
    (function(a, b) {
      var c = a.keapForms || {
          SNIPPET_VERSION: "1.1.0",
          appId: "qa317"
        },
        d = b.createElement("script");
      d.type = "text/javascript", d.crossOrigin = "anonymous", d.defer = !0, d.src = "https://forms.keap.app/lib/public-form-embed.js?appId=qa317&version=1.1.0", d.onload = function() {
        var b = a.keapForms;
        b.renderAllForms ? !b.invoked && (b.invoked = !0, b.renderAllForms()) : console.error("[Keap Forms] Error: could not load")
      };
      var e = b.getElementsByTagName("script")[0];
      e.parentNode.insertBefore(d, e), a.keapForms = c
    })(window, document);
  },

  computed: {
    ...mapState(['user', 'releases']),

    latestRelease() {
      return this.releases?.[0]?.tag_name;
    },
  },
};
</script>
