<!-- TODO: add subsection value in store to keep track of when they should be opened -->
<!-- TODO: finsih this, make all block, must be good to clone -->
<template>
  <div>
    <b-button-group block class="w-100">
      <b-button
        :variant="darkTheme ? 'dark' : 'light'"
        block
        :to="{ name: 'boards' }"
      >
        <i class="fa-regular fa-rectangle-list" />
        <span class="ml-2">Boards</span>
      </b-button>
      
      <b-button
        v-if="!isBoardPage"
        v-b-toggle.boards-collapse
        :variant="darkTheme ? 'dark' : 'light'"
      >
        <i class="fa-regular fa-caret-up"></i>
      </b-button>
    </b-button-group>

    <b-collapse
      id="boards-collapse"
      :visible="isBoardPage"
    >
      <b-card
        class="m-2"
        :bg-variant="darkTheme ? 'dark' : 'light'"
        :text-variant="darkTheme ? 'light' : 'dark'"
        :title="board.name"
      >
        <b-card-text>
          {{ board.description }}
        </b-card-text>
        
        <b-button
            v-if="canEdit"
            block
            :to="{ name: 'board.edit', params: { id: board.id } }"
            :variant="darkTheme ? 'dark' : 'light'"
        >
            <i class="fa-solid fa-pen fa-fw" />
            <span class="ml-2">Edit board</span>
        </b-button>
      </b-card>

      <b-button
        block
        :variant="darkTheme ? 'dark' : 'light'"
        :to="{ name: 'create.board' }"
      >
          <i class="fa-regular fa-plus fa-fw" />
          <span class="ml-2">Create board</span>
      </b-button>

      <b-button
        :variant="darkTheme ? 'dark' : 'light'"
        block
        disabled
      >
        <i class="fa-solid fa-clone fa-fw"></i>
        <span class="ml-2">Copy board</span>
      </b-button>

      <b-button
          v-for="board in recentlyUpdatedBoards"
          :variant="darkTheme ? 'dark' : 'light'"
          :key="board.id"
          block
          :to="{ name: 'board', params: { id: board.id } }"
      >
          <small>{{ board.name }}</small>
      </b-button>

      <b-button
        :variant="darkTheme ? 'dark' : 'light'"
        block
        :to="{ name: 'public.boards' }"
      >
        <i class="fa-solid fa-users-rectangle fa-fw" />
        <span class="ml-2">Public boards</span>
      </b-button>
    </b-collapse>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    computed: {
      ...mapState(['board']),
      ...mapGetters(['sortedBoards', 'isBoardOwner', 'darkTheme']),
      
      boardButtonTitle() {
        if (this.isBoardEditPage || this.isBoardPage) return this.board.name;
        
        return 'Boards';
      },

      isBoardPage() {
        return ['board', 'board.edit', 'boards'].includes(this.$route.name);
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
