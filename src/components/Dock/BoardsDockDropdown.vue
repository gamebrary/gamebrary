<template>
    <b-dropdown
      v-b-tooltip.hover.auto= "{ delay: { show: 500, hide: 50 } }"
      :title="boardButtonTitle"
      :variant="isBoardPage ? 'white' : 'transparent'"
      v-bind="dockDropdownProps"
    >
        <template #button-content>
          <img
            src="/img/dock-icons/boards.png"
            alt="wikipedia"
            width="24"
          />
        </template>

        <b-dropdown-item
            :to="{ name: 'boards' }"
        >
            <i class="fa-regular fa-rectangle-list fa-fw"></i>
            <span class="ml-2">My boards</span>
        </b-dropdown-item>

        <!-- <b-dropdown-group v-if="user" class="p-1 bg-light m-1 rounded">
            <b-dropdown-item
                v-for="board in recentlyUpdatedBoards"
                :key="board.id"
                :to="{ name: 'board', params: { id: board.id } }"
            >
                <small>{{ board.name }}</small>
            </b-dropdown-item>
        </b-dropdown-group> -->

        <!-- <b-dropdown-item
            v-if="isBoardEditPage"
            :to="{ name: 'board', params: { id: board.id } }"
        >
            <i class="fa-solid fa-caret-left"></i>
            <span class="ml-2">Back to board</span>
        </b-dropdown-item> -->

        <b-dropdown-item
            v-if="canEdit"
            :to="{ name: 'board.edit', params: { id: board.id } }"
        >
            <i class="fa-solid fa-pen fa-fw" />
            <span class="ml-2">Edit board</span>
        </b-dropdown-item>

        <b-dropdown-item
            :to="{ name: 'create.board' }"
        >
            <i class="fa-regular fa-plus fa-fw" />
            <span class="ml-2">Create board</span>
        </b-dropdown-item>
        
        <!-- TODO: add logic for this -->
        <b-dropdown-item
          disabled
        >
          <i class="fa-solid fa-clone fa-fw"></i>
          <span class="ml-2">Copy board</span>
      </b-dropdown-item>

      <b-dropdown-divider />

      <b-dropdown-item
        :to="{ name: 'public.boards' }"
      >
        <i class="fa-solid fa-users-rectangle fa-fw" />
        <span class="ml-2">Public boards</span>
      </b-dropdown-item>
    </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    data() {
      return {
          // Your data properties here
      };
    },

    computed: {
      ...mapState(['board', 'user']),
      ...mapGetters(['isVerticalNav', 'dockDropdownProps', 'sortedBoards', 'isBoardOwner', 'darkTheme']),
      
      boardButtonTitle() {
        if (this.isBoardEditPage || this.isBoardPage) return this.board.name;
        
        return 'Boards';
      },

      isBoardPage() {
        return ['board', 'board.edit'].includes(this.$route.name);
      },

      canEdit() {
        return Boolean(this.$route.name === 'board' && this.isBoardOwner);
      },

      recentlyUpdatedBoards() {
        return this.sortedBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 3);
      },
    },

    methods: {
        // Your methods here
    },
    mounted() {
        // Code to run when the component is mounted
    },
};
</script>

<style scoped>
/* Your component-specific styles here */
</style>
