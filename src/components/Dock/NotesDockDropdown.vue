<template>
  <b-dropdown
    v-if="user"
    v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
    title="Notes"
    v-bind="dockDropdownProps"
  >
    <template #button-content>
      <i class="fa-regular fa-note-sticky"></i>
    </template>

    <b-dropdown-item
      :to="{ name: 'create.note' }"
    >
    <i class="fa-regular fa-note-medical"></i>
      <span class="ml-2">New note</span>
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'notes' }">
      <i class="fa-regular fa-notes"></i>

      <span class="ml-2">My notes</span>
    </b-dropdown-item>
  </b-dropdown>
</template>
  
  <script>
  import { mapState, mapGetters } from 'vuex'
  import { getImageUrl } from '@/utils';
  
  export default {
    getImageUrl,
    data() {
      return {
  
      };
    },
  
    computed: {
      ...mapState(['user']),
      ...mapGetters(['dockDropdownProps']),
    },
  };
  </script>
  
  <style scoped></style>
    