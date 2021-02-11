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

    <b-card>
      <p>Game modal shortucts</p>

      <p>
        <kbd class="mr-1">
          <i class="fas fa-angle-left fa-fw" aria-hidden />
        </kbd>
        Previous game
      </p>

      <p>
        <kbd class="mr-1">
          <i class="fas fa-angle-right fa-fw" aria-hidden />
        </kbd>
        Next game
      </p>

      <p>
        <kbd class="mr-1">
          T
        </kbd>
        Game Tags
      </p>

      <p>
        <kbd class="mr-1">
          N
        </kbd>
        Game notes
      </p>

      <p>
        <kbd class="mr-1">
          P
        </kbd>
        Game progress
      </p>
    </b-card>
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
