<template lang="html">
  <b-sidebar
    id="create-board-sidebar"
    v-bind="sidebarProps"
    right
    @hidden="saving = false"
  >
    <template #default="{ hide }">
      <SidebarHeader
        @hide="hide"
        title="Create board"
      />

      <b-form
        class="p-3"
        @submit.prevent="createBoard"
      >
        <b-form-group label="Board name:" label-for="boardName">
          <b-form-input
            id="boardName"
            v-model.trim="board.name"
            autofocus
            required
          />
        </b-form-group>

        <p>Board type:</p>
        <b-button-group class="mb-2">
          <b-button
            v-for="{ text, value } in $options.BOARD_TYPES"
            :key="value"
            :variant="value === board.type ? 'primary' : 'light'"
            @click="board.type = value"
          >
            {{ text }}
          </b-button>
        </b-button-group>

        <MiniBoard
          class="mb-2"
          :board="sampleBoardWithRandomizedGames"
        />

        <b-form-checkbox
          v-if="board.type === $options.BOARD_TYPE_STANDARD"
          v-model="board.ranked"
          name="check-button"
          class="mb-3"
          switch
        >
          Ranked
        </b-form-checkbox>

        <b-form-checkbox v-model="board.isPublic" switch class="mb-2">
          Public
        </b-form-checkbox>

        <b-button
          variant="primary"
          class="mt-3"
          loading
          type="submit"
        >
          <b-spinner small v-if="saving" />
          <template v-else>Create board</template>
        </b-button>
      </b-form>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BOARD_TYPES,
  BOARD_TYPE_KANBAN,
  BOARD_TYPE_STANDARD,
  BOARD_TYPE_TIER,
  DEFAULT_BOARD_KANBAN,
  DEFAULT_BOARD_STANDARD,
  DEFAULT_BOARD_TIER,
} from '@/constants';
import MiniBoard from '@/components/Board/MiniBoard';
import SidebarHeader from '@/components/SidebarHeader';
import { mapState, mapGetters } from 'vuex';

export default {
  BOARD_TYPES,
  BOARD_TYPE_TIER,
  BOARD_TYPE_STANDARD,
  DEFAULT_BOARD_TIER,

  components: {
    MiniBoard,
    SidebarHeader,
  },

  data() {
    return {
      board: {},
      saving: false,
      selectedTemplate: null,
    };
  },

  mounted() {
    this.board = {
      ...this.sampleBoard,
      type: BOARD_TYPE_KANBAN,
    }
  },

  computed: {
		...mapState(['user']),
		...mapGetters(['sidebarProps']),

    sampleBoard() {
      if (this.board.type === BOARD_TYPE_KANBAN) return DEFAULT_BOARD_KANBAN;
      if (this.board.type === BOARD_TYPE_TIER) return DEFAULT_BOARD_TIER;
      if (this.board.type === BOARD_TYPE_STANDARD) return DEFAULT_BOARD_STANDARD;

      return DEFAULT_BOARD_KANBAN;
    },

    sampleBoardWithRandomizedGames() {
      const randomizedListWithGames = this.sampleBoard?.lists?.map((list) => ({
        ...list,
        games: list.games = Array.from({length: Math.floor(Math.random() * 5) + 2 }, () => ''),
      }));

      return {
        ...this.sampleBoard,
        lists: this.board.type === BOARD_TYPE_TIER
          ? DEFAULT_BOARD_TIER.lists
          : randomizedListWithGames,
      }
    }
  },

  methods: {
    async createBoard() {
      try {
        this.saving = true;

        const dateCreated = Date.now();

        const payload = {
          ...this.sampleBoard,
          ...this.board,
          dateCreated,
          lastUpdated: dateCreated,
          lists: this.sampleBoard.lists.map((list) => ({ ...list, games: [] })),
          owner: this.user.uid,
        }

        const { id } = await this.$store.dispatch('CREATE_BOARD', payload);

        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        //
      }
    },
  },
};
</script>
