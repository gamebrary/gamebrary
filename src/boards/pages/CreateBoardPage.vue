<template lang="html">
  <section>
    <b-container>
      <!-- <page-title title="Create board" /> -->
      <portal to="pageTitle">
        <h3>Create board</h3>
      </portal>

      <b-form @submit.prevent="createBoard" class="field centered">
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

        <mini-board
          class="mb-2"
          :board="sampleBoardWithGames"
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
    </b-container>
  </section>
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


export default {
  BOARD_TYPES,
  BOARD_TYPE_TIER,
  BOARD_TYPE_STANDARD,
  DEFAULT_BOARD_TIER,

  components: {
    MiniBoard,
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
    sampleBoard() {
      if (this.board.type === BOARD_TYPE_KANBAN) return DEFAULT_BOARD_KANBAN;
      if (this.board.type === BOARD_TYPE_TIER) return DEFAULT_BOARD_TIER;
      if (this.board.type === BOARD_TYPE_STANDARD) return DEFAULT_BOARD_STANDARD;

      return DEFAULT_BOARD_KANBAN;
    },

    sampleBoardWithGames() {
      return {
        ...this.sampleBoard,
        lists: this.sampleBoard?.lists?.map((list) => ({
          ...list,
          games: list.games = Array.from({length: Math.floor(Math.random() * 5) + 3 }, () => ''),
        })),
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
          lists: this.sampleBoard.lists.map((list, index) => ({ ...list, games: [] })),
        }

        const { id } = await this.$store.dispatch('CREATE_BOARD', payload);
        this.$bus.$emit('ALERT', { type: 'success', message: 'Board created' });

        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        this.$bus.$emit('ALERT', { type: 'error', message: 'Error creating board' });
      }
    },
  },
};
</script>
