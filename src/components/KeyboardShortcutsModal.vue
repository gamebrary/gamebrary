<template lang="html">
  <AppSidebar
    id="keyboard-shortcuts-sidebar"
    :visible="visible"
    :placement="sidebarLeftProps?.placement || 'start'"
    :bg-variant="sidebarLeftProps?.bgVariant"
    :text-variant="sidebarLeftProps?.textVariant"
    :z-index="2001"
    @update:visible="handleVisibilityChange"
    @hidden="hideSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Keyboard Shortcuts" />
    </template>

    <ul class="list-group mx-3">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
      >
        <kbd class="me-1">Esc </kbd>
        Close modal
      </li>

      <li
        v-for="(shortcut, name) in KEYBOARD_SHORTCUTS"
        :key="name"
        class="list-group-item d-flex justify-content-between align-items-center"
        :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
      >
        <span>
          <kbd
            v-for="key in shortcut"
            :key="key"
            class="me-1"
          >
            {{ key }}
          </kbd>
        </span>

        {{ $t(`shortcuts.${name.substr(6)}`) }}
      </li>
    </ul>
  </AppSidebar>
</template>

<script>
import { KEYBOARD_SHORTCUTS } from '@/constants';
import { mapState, mapGetters } from 'vuex';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';

export default {
  components: {
    AppSidebar,
    SidebarHeader,
  },

  data() {
    return {
      KEYBOARD_SHORTCUTS,
      visible: false,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme', 'sidebarLeftProps']),
  },

  mounted() {
    if (this.$bus) {
      this.$bus.$on('HANDLE_SHORTCUT', this.handleShortcut);
    }
    // Listen for sidebar toggle events
    this.$root.$on('bv::toggle::collapse', (id) => {
      if (id === 'keyboard-shortcuts-sidebar') {
        this.visible = !this.visible;
      }
    });
  },

  beforeUnmount() {
    if (this.$bus) {
      this.$bus.$off('HANDLE_SHORTCUT');
    }
    this.$root.$off('bv::toggle::collapse');
  },

  methods: {
    handleVisibilityChange(visible) {
      this.visible = visible;
    },

    hideSidebar() {
      this.visible = false;
    },

    handleShortcut({ srcKey }) {
      if (!srcKey) return;

      const name = srcKey?.substr(6);

      if (srcKey.includes('MODAL')) {
        // Handle modal show - need to check how modals are handled now
        const modalElement = document.getElementById(name);
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modal.show();
        }
      }
      if (srcKey.includes('ROUTE') && this.$route.name !== name) this.$router.push({ name });
    },
  },
};
</script>
