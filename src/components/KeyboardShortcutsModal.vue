<template lang="html">
  <b-sidebar
    id="keyboard-shortcuts-sidebar"
    v-bind="sidebarProps"
    z-index="2001"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide">
        Keyboard Shortcuts
      </SidebarHeader>

      <b-list-group class="mx-3">
        <b-list-group-item
          :variant="darkTheme ? 'dark' : 'light'"
          class="d-flex justify-content-between align-items-center"
        >
          <kbd class="mr-1">Esc </kbd>
          Close modal
        </b-list-group-item>

        <b-list-group-item
          v-for="(shortcut, name) in KEYBOARD_SHORTCUTS"
          :key="name"
          :variant="darkTheme ? 'dark' : 'light'"
          class="d-flex justify-content-between align-items-center"
        >
          <span>
            <kbd
              v-for="key in shortcut"
              :key="key"
              class="mr-1"
            >
              {{ key }}
            </kbd>
          </span>

          {{ $t(`shortcuts.${name.substr(6)}`) }}
        </b-list-group-item>
      </b-list-group>
    </template>
  </b-sidebar>
</template>

<script>
import { KEYBOARD_SHORTCUTS } from '@/constants';
import { mapState, mapGetters } from 'vuex';
import SidebarHeader from '@/components/SidebarHeader';

export default {
  components: {
    SidebarHeader,
  },

  data() {
    return {
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme', 'sidebarProps']),
  },

  mounted() {
    this.$bus.$on('HANDLE_SHORTCUT', this.handleShortcut);
  },

  destroyed() {
    this.$bus.$off('HANDLE_SHORTCUT');
  },

  methods: {
    handleShortcut({ srcKey }) {
      if (!srcKey) return;

      const name = srcKey?.substr(6);

      if (srcKey.includes('MODAL')) this.$bvModal.show(name);
      if (srcKey.includes('ROUTE') && this.$route.name !== name) this.$router.push({ name });
    },
  },
};
</script>
