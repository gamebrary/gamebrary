<template lang="html">
  <b-button
    variant="primary"
    v-b-modal:create-board
    :disabled="!Object.keys(platforms).length"
  >
    Create board

    <b-modal
      id="create-board"
      title="Create board"
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
            required
          />
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Board descriptiopn"
          label-for="description"
          description="Optional"
        >
          <b-form-textarea
            id="description"
            v-model="board.description"
            maxlength="280"
            rows="3"
          />
        </b-form-group>

        <b-form-group label="Board template">
          <b-form-radio-group
            id="btn-radios-1"
            v-model="selectedTemplate"
            :options="boardTemplatesOptions"
            buttons
            button-variant="outline-primary"
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

        <template v-if="platforms.length">
          <b-form-group label="Select platform(s)">
            <b-dropdown id="dropdown-1" text="Select platform(s)" menu-class="h-40">
              <b-dropdown-item
                v-for="platform in filteredPlatforms"
                :key="platform.id"
                @click="selectPlatform(platform)"
              >
                {{ platform.name }}
              </b-dropdown-item>
            </b-dropdown>
          </b-form-group>

          <b-button
            variant="primary"
            class="ml-1 mb-1"
            v-for="({ id, name }, index) in board.platforms"
            :key="id"
          >
            {{ name }}

            <b-badge
              variant="light"
              class="ml-1"
              @click="removePlatform(index)"
            >
              <b-icon-x />
            </b-badge>
          </b-button>
        </template>
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          Cancel
        </b-button>

        <b-button
          variant="primary"
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
import { mapState } from 'vuex';

export default {
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

  computed: {
    ...mapState(['platforms']),

    filteredPlatforms() {
      return this.platforms.length && this.board.platforms
        ? this.platforms.filter(({ id }) => !this.flattenedSelectedPlatforms.includes(id))
        : [];
    },

    flattenedSelectedPlatforms() {
      return this.board && this.board.platforms && this.board.platforms.length
        ? Object.values(this.board.platforms.map(({ id }) => id))
        : [];
    },
  },

  methods: {
    resetBoard() {
      this.board = {
        name: null,
        description: null,
        theme: null,
        backgroundColor: '#ccc',
        platforms: [],
        lists: [],
      };
    },

    selectPlatform({ id, name }) {
      this.board.platforms.push({ id, name });
    },

    removePlatform(index) {
      this.board.platforms.splice(index, 1);
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.createBoardForm.checkValidity()) {
        this.createBoard();
      }
    },

    async createBoard() {
      const { selectedTemplate, boardTemplates, board } = this;

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
        : [];

      const payload = {
        ...board,
        platforms: this.flattenedSelectedPlatforms,
        lists,
      };

      await this.$store.dispatch('CREATE_BOARD', payload)
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an creating board', { title: 'Error', variant: 'error' });
        });

      this.saving = false;
      this.$bvToast.toast('Board crated', { title: 'Success', variant: 'success' });
      this.$bvModal.hide('create-board');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
ul.dropdown-menu {
  max-height: 300px !important;
  overflow: auto !important;
}
</style>
