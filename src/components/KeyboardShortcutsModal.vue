<template lang="html">
  <b-modal
    id="keyboard-shortcuts"
    title="BootstrapVue"
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Keyboard Shortcuts"
        @close="close"
      />
    </template>

    <p>
      <b-badge class="mr-1">Esc </b-badge>
      Close modal
    </p>

    <p
      v-for="(shortcut, name) in KEYBOARD_SHORTCUTS"
      :key="name"
    >
      <b-badge
        v-for="key in shortcut"
        :key="key"
        class="mr-1"
      >
        {{ key }}
      </b-badge>

      {{ $t(`shortcuts.${name.substr(6)}`) }}
    </p>
  </b-modal>
</template>

<script>
import { KEYBOARD_SHORTCUTS } from '@/constants';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      KEYBOARD_SHORTCUTS,
    };
  },

  computed: {
    ...mapState(['user']),
  },

  mounted() {
    this.$bus.$on('HANDLE_SHORTCUT', this.handleShortcut);
  },

  destroyed() {
    this.$bus.$off('HANDLE_SHORTCUT');
  },

  methods: {
    handleShortcut({ srcKey }) {
      const name = srcKey.substr(6);

      if (srcKey.includes('MODAL')) {
        this.$bvModal.show(name);
      }

      if (srcKey.includes('ROUTE')) {
        if (this.$route.name !== name) {
          this.$router.push({ name });
        }
      }
    },
  },
};
</script>
