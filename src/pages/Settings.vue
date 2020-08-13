<template lang="html">
  <modal title="Settings">
    <b-avatar
      v-if="user && user.email"
      variant="info"
      :src="user.photoURL"
    />

    <div
      slot="content"
      class="settings"
    >
      <game-board-settings v-model="localSettings" @save="save" v-if="isGameBoard" />

      <h3>Global</h3>
      <tags-settings v-model="localSettings" />

      <div class="setting">
        <i class="fas fa-sign-out-alt" />
        {{ $t('settings.signOut') }}

        <b-button @click="signOut">
          {{ $t('settings.signOut') }}
        </b-button>
      </div>

      <modal
        :message="$t('settings.deleteAccount.message')"
        :title="$t('settings.deleteAccount.title')"
        :action-text="$t('settings.deleteAccount.button')"
        @action="deleteAccount"
      >
        <div class="setting">
          <i class="fas fa-exclamation-triangle" />
          {{ $t('settings.deleteAccount.button') }}

          <b-button variant="danger">
            {{ $t('settings.deleteAccount.button') }}
          </b-button>
        </div>
      </modal>
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
import 'firebase/firestore';
import 'firebase/auth';
import GameBoardSettings from '@/components/Settings/GameBoardSettings';
import SettingsGlobal from '@/components/Settings/SettingsGlobal';
import AboutSettings from '@/components/Settings/AboutSettings';
import TagsSettings from '@/components/Settings/TagsSettings';
import Modal from '@/components/Modal';
import moment from 'moment';
import firebase from 'firebase/app';
import Releases from '@/components/Releases/Releases';

export default {
  components: {
    Modal,
    Releases,
    GameBoardSettings,
    SettingsGlobal,
    AboutSettings,
    TagsSettings,
  },

  data() {
    return {
      activeSection: null,
      activeComponent: null,
      language: null,
      reloading: false,
      localSettings: null,
      moment,
      defaultSettings: {
        language: 'en',
        theme: {
          global: 'default',
        },
        position: {
          global: 'top',
        },
        borderRadius: true,
        showGameCount: false,
      },
    };
  },

  computed: {
    ...mapState(['user', 'gameLists', 'settings', 'platform']),

    dateJoined() {
      return moment(this.user.dateJoined).format('LL');
    },

    isGameBoard() {
      return this.$route.name === 'game-board';
    },

    exitUrl() {
      // TODO: move to getter and replace other instances
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://gamebrary.com';
    },
  },

  mounted() {
    this.localSettings = this.settings !== null
      ? JSON.parse(JSON.stringify(this.settings))
      : JSON.parse(JSON.stringify(this.defaultSettings));

    if (this.platform && !this.localSettings[this.platform.code]) {
      this.localSettings[this.platform.code] = {
        theme: 'default',
        position: 'top',
        borderRadius: true,
        showGameCount: false,
      };
    }
  },

  methods: {
    save() {
      this.$store.dispatch('SAVE_SETTINGS', this.localSettings)
        .then(() => {
          this.$bvToast.toast('Settings saved', { title: 'Success', variant: 'success' });
        })
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    deleteAccount() {
      const db = firebase.firestore();

      // TODO: Add progress bar, delete tags, files, etc...
      // TODO: move to actions
      db.collection('settings').doc(this.user.uid).delete()
        .then(() => {
        // TODO: move to actions
          db.collection('lists').doc(this.user.uid).delete()
            .then(() => {
              this.$bvToast.toast('Account deleted', { title: 'Success', variant: 'success' });
              this.exit();
            })
            .catch(() => {
              this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
              this.$router.push({ name: 'sessionExpired' });
            });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    signOut() {
      firebase.auth().signOut()
        .then(() => {
          this.exit();
        })
        .catch((error) => {
          this.$bvToast.toast(error, { title: 'Error', variant: 'danger' });
        });
    },

    exit() {
      this.$store.commit('CLEAR_SESSION');
      window.location.href = this.exitUrl;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "~styles/styles";

  $avatarSize: 30px;

  .settings {
    display: flex;
    flex-direction: column;
  }

  .avatar {
    width: $avatarSize;
    height: $avatarSize;
    border-radius: var(--border-radius);
    overflow: hidden;
  }
</style>
