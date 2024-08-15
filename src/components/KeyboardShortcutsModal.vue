<template lang="html">
  <b-sidebar
    id="keyboard-shortcuts-sidebar"
    shadow
    no-header
    backdrop
    width="380px"
    z-index="2001"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
  >
  <template #default="{ hide }">
    <div class="d-flex align-items-center justify-content-between p-3">
      <h3>Keyboard Shortcuts</h3>
        
        <b-button
          :variant="darkTheme ? 'black' : 'white'"
          @click="hide"
        >
          <i class="fa-solid fa-xmark" />
        </b-button>
      </div>

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
