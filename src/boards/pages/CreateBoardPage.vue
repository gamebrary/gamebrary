<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Create board</portal>

      <b-form @submit.prevent="createBoard" class="field centered">
        <b-form-group label="Board name:" label-for="boardName">
          <b-form-input
            id="boardName"
            v-model.trim="board.name"
            placeholder="PS4 collection, Nintendo Switch, etc..."
            autofocus
            required
          />
        </b-form-group>

        <b-form-group
          label="Board type"
          label-for="boardType"
        >
          <b-form-select
            id="boardType"
            v-model="board.type"
            :options="$options.BOARD_TYPES"
          />
        </b-form-group>

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

export default {
  BOARD_TYPES,
  BOARD_TYPE_TIER,
  BOARD_TYPE_STANDARD,

  data() {
    return {
      board: {},
      saving: false,
      selectedTemplate: null,
    };
  },

  mounted() {
    this.board = {
      ...this.getDefaultBoard(),
      type: BOARD_TYPE_STANDARD,
    }
  },

  methods: {
    getDefaultBoard() {
      if (this.board.type === BOARD_TYPE_TIER) return DEFAULT_BOARD_TIER;
      if (this.board.type === BOARD_TYPE_KANBAN) return DEFAULT_BOARD_KANBAN;

      return DEFAULT_BOARD_STANDARD;
    },

    async createBoard() {
      this.saving = true;
      const defaultBoard = this.getDefaultBoard();

      const payload = {
        ...defaultBoard,
        ...this.board,
        lists: defaultBoard.lists,
      }

      try {
        const { id } = await this.$store.dispatch('CREATE_BOARD', payload);

        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        this.$bvToast.toast('There was an error creating board', { variant: 'error' });
      }
    },
  },
};
</script>
