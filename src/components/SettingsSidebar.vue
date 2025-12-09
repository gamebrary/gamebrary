<template lang="html">
  <AppSidebar
    id="settings-sidebar"
    :visible="visible"
    :placement="sidebarLeftProps?.placement || 'start'"
    :bg-variant="sidebarLeftProps?.bgVariant"
    :text-variant="sidebarLeftProps?.textVariant"
    :z-index="2001"
    @update:visible="handleVisibilityChange"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Settings" />
    </template>

      <div class="p-3">
        <div class="form-check form-switch mb-1">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="darkTheme"
            @change="toggleTheme"
            id="darkThemeSwitch"
          />
          <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="darkThemeSwitch">
            Dark theme
          </label>
        </div>

        <div class="form-check form-switch mb-1">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="showGameThumbnails"
            @change="toggleGameThumbnails"
            id="gameThumbnailsSwitch"
          />
          <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="gameThumbnailsSwitch">
            Game covers in board preview
          </label>
        </div>

        <div class="form-check form-switch mb-1">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="transparencyEnabled"
            @change="toggleTransparency"
            id="transparencySwitch"
          />
          <label class="form-check-label" :class="darkTheme ? 'text-light' : null" for="transparencySwitch">
            Transparency
          </label>
        </div>

        <div class="p-1 mb-1">
          <span :class="darkTheme ? 'text-light' : null">Preferred age rating</span>

          <select
            class="form-select"
            :value="ageRating"
            @change="setPreferredGameRating($event.target.value)"
          >
            <option
              v-for="option in ageRatingOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="p-1 mb-1">
          <span :class="darkTheme ? 'text-light' : null">Menu position</span>

          <select
            class="form-select"
            :value="navPosition"
            @change="setNavPosition($event.target.value)"
          >
            <option
              v-for="option in navPositionOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>

        <DeleteAccountModal />

        <div class="mt-4 d-inline-flex flex-column">
          <button
            type="button"
            class="btn mb-2"
            :class="darkTheme ? 'btn-dark' : 'btn-light'"
            @click="signOut"
          >
            <i class="fa-regular fa-right-from-bracket fa-fw" />
            Sign out
          </button>

          <a
            href="https://accounts.google.com/"
            class="btn btn-info mb-2"
            target="_blank"
          >
            Manage account
          </a>

          <a
            href="#"
            class="mb-2 text-danger px-3 py-2"
            @click="openDeleteAccountSidebar"
          >
            Delete account
          </a>
        </div>
      </div>
  </AppSidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';
import { AGE_RATINGS } from '@/constants';

export default {
  AGE_RATINGS,

  data() {
    return {
      navPositionOptions: [
        { value: 'top', text: 'Top' },
        { value: 'bottom', text: 'Bottom' },
      ],
      visible: false,
    };
  },

  components: {
    AppSidebar,
    DeleteAccountModal,
    SidebarHeader,
  },

  computed: {
    ...mapState(['settings']),
    ...mapGetters(['darkTheme', 'showGameThumbnails', 'transparencyEnabled', 'ageRating', 'navPosition', 'sidebarLeftProps']),

    ageRatingOptions() {
      return AGE_RATINGS.map((rating) => ({
          value: rating.id,
          text: rating.name,
        }));
    },
  },

  mounted() {
    // Listen for sidebar toggle events
    if (this.$bus) {
      this.$bus.$on('bv::toggle::collapse', (id) => {
        if (id === 'settings-sidebar') {
          this.visible = !this.visible;
        }
      });
    }
  },

  beforeUnmount() {
    if (this.$bus) {
      this.$bus.$off('bv::toggle::collapse');
    }
  },

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    hideSidebar() {
      this.visible = false;
    },
    showToast(message, variant = 'info') {
      const toastElement = document.createElement('div');
      toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
      toastElement.setAttribute('role', 'alert');
      toastElement.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      document.body.appendChild(toastElement);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    },


    async setPreferredGameRating(ageRating) {
      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          ageRating,
        });
      } catch (e) {
        this.showToast('There was an error saving your settings', 'danger');
      }

      this.saving = false;
    },

    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.showToast('There was an error saving your settings', 'danger');
          this.saving = false;
        });
    },

    async signOut() {
			await this.$store.dispatch('SIGN_OUT');
			this.showToast('Logged out', 'success');
			this.$store.commit('CLEAR_SESSION');
			this.$router.replace({ name: 'home' });
		},

    async toggleGameThumbnails() {
      const { settings } = this;
      const showGameThumbnails = settings?.showGameThumbnails || false;

      const payload = {
        ...settings,
        showGameThumbnails: !showGameThumbnails,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.showToast('There was an error saving your settings', 'danger');
          this.saving = false;
        });
    },

    async setNavPosition(navPosition) {
      this.$refs.settingsDropdown?.hide();

      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          navPosition,
        });
      } catch (e) {
        this.showToast('There was an error saving your settings', 'danger');
      }

      this.saving = false;
    },

    async toggleTransparency() {
      const transparencyEnabled = this.settings?.transparencyEnabled || false;

      const payload = {
        ...this.settings,
        transparencyEnabled: !transparencyEnabled,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.showToast('There was an error saving your settings', 'danger');
          this.saving = false;
        });
    },

    openDeleteAccountSidebar() {
      this.hideSidebar();
      const modalElement = document.getElementById('delete-account-modal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.show();
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
