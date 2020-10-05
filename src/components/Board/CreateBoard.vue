<template lang="html">
  <b-button
    variant="primary"
    v-b-modal:create-board
  >
    {{ $t('boards.create') }}

    <b-modal
      id="create-board"
      title="Create board"
      size="lg"
      @show="resetBoard"
      @hidden="resetBoard"
    >
      <form ref="createBoardForm" @submit.stop.prevent="submit">
        <b-form-group
          label="Board name"
          label-for="name"
        >
          <b-form-input
            id="name"
            v-model="board.name"
            autofocus
            required
          />
        </b-form-group>

        <b-form-group
          label="Board description"
          label-for="description"
          description="Optional"
        >
          <b-form-textarea
            v-model="board.description"
            maxlength="280"
            rows="2"
          />
        </b-form-group>

        <platform-picker
          v-model="board.platforms"
        />

        <hr />

        <b-form-group label="Board template">
          <b-form-radio-group
            v-model="selectedTemplate"
            :options="boardTemplatesOptions"
            buttons
            name="radios-btn-default"
            description="Optional"
          />

          <b-row v-if="selectedTemplate" class="mt-3">
            <b-col v-for="column in boardTemplates[selectedTemplate]" :key="column">
              <b-card
                :header="column"
                header-tag="header"
                header-class="p-1 pl-2"
                hide-footer
              />
            </b-col>
          </b-row>
        </b-form-group>
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          Cancel
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Save</span>
        </b-button>
      </template>
    </b-modal>
  </b-button>
</template>

<script>
import PlatformPicker from '@/components/Board/PlatformPicker';

export default {
  components: {
    PlatformPicker,
  },

  data() {
    return {
      board: {},
      platformCategories: {
        1: 'console',
        2: 'arcade',
        3: 'platform',
        4: 'operating_system',
        5: 'portable_console',
        6: 'computer',
      },
      saving: false,
      selectedTemplate: null,
      boardTemplatesOptions: [
        { value: null, text: 'Blank' },
        { value: 'standard', text: 'Standard' },
        { value: 'detailed', text: 'Detailed' },
        { value: 'completionist', text: 'Completionist' },
      ],
      boardTemplates: {
        standard: ['Owned', 'Wishlist'],
        detailed: ['Physical', 'Digital', 'Wishlist'],
        completionist: ['Owned', 'Playing', 'Completed'],
      },
    };
  },

  methods: {
    resetBoard() {
      this.board = {
        name: null,
        description: null,
        theme: null,
        wallpaper: null,
        platforms: [],
        lists: [],
      };
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.createBoardForm.checkValidity()) {
        this.createBoard();
      }
    },

    async createBoard() {
      const { selectedTemplate, boardTemplates, board } = this;

      if (board.platforms.length === 0) {
        return this.$bvToast.toast('Please select at least 1 platform', { title: 'Error', variant: 'error' });
      }

      this.saving = true;

      const lists = selectedTemplate && boardTemplates[selectedTemplate]
        ? boardTemplates[selectedTemplate].map((name) => {
          const list = {
            name,
            games: [],
            settings: {},
          };

          return list;
        })
        : [{
          name: 'List name here',
          games: [],
          settings: {},
        }];

      const payload = {
        ...board,
        lists,
      };

      await this.$store.dispatch('CREATE_BOARD', payload)
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error creating board', { title: 'Error', variant: 'error' });
        });

      this.saving = false;
      this.$bvToast.toast('Board crated', { title: 'Success', variant: 'success' });
      return this.$bvModal.hide('create-board');
    },
  },
};
</script>
