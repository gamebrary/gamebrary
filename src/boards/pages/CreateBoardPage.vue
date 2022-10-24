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
          label="Board description"
          label-for="boardDescription"
        >
          <b-form-textarea
            id="boardDescription"
            v-model="board.description"
            maxlength="280"
            rows="2"
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
          v-if="board.type === $options.BOARD_TYPE_LIST"
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


        <!-- TODO: if list type is list, ask if ranked or not -->

        <b-button
          variant="primary"
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
import { BOARD_TYPES, BOARD_TYPE_LIST } from '@/constants';

export default {
  BOARD_TYPES,

  data() {
    return {
      board: {
        name: '',
        description: '',
        lists: [],
        type: 'kanban',
      },
      saving: false,
      selectedTemplate: null,
    };
  },

  methods: {
    async createBoard() {
      this.saving = true;

      try {
        // TODO: put default board in constant
        const payload = {
          ...this.board,
          // TODO: set default lists based on board type
          games: [],
          lastUpdated: Date.now(),
          ranked: false,
          lists: [{
            name: 'Click to rename',
            games: [],
            settings: {
              showReleaseDates: false,
              sortOrder: 'sortByCustom',
              showGameTags: false,
              showGameNotes: false,
              showGameCount: false,
              view: 'single'
            },
          }],
        };

        const { id } = await this.$store.dispatch('CREATE_BOARD', payload);

        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        this.$bvToast.toast('There was an error creating board', { variant: 'error' });
      }
    },
  },
};
</script>
