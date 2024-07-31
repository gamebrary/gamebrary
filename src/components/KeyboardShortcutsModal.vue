<template lang="html">
  <b-sidebar
    id="keyboard-shortcuts-sidebar"
    shadow
    no-header
    backdrop
    width="380px"
    body-class="p-3"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
  >
    <h3 class="mb-3">Keyboard Shortcuts</h3>
    <p>
      <kbd class="mr-1">Esc </kbd>
      Close modal
    </p>

    <p
      v-for="(shortcut, name) in KEYBOARD_SHORTCUTS"
      :key="name"
    >
      <kbd
        v-for="key in shortcut"
        :key="key"
        class="mr-1"
      >
        {{ key }}
      </kbd>

      {{ $t(`shortcuts.${name.substr(6)}`) }}
    </p>
  </b-sidebar>
</template>

<script>
import { KEYBOARD_SHORTCUTS } from '@/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme']),
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
