<template lang="html">
  <b-button
    :variant="nightMode ? 'light' : 'primary'"
    v-b-modal:create-board
  >
    {{ $t('boards.create') }}

    <b-modal
      id="create-board"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      hide-footer
      scrollable
      @show="init"
      @hidden="init"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('boards.create')"
          :subtitle="modalSubtitle"
          @close="close"
        />
      </template>

      <template v-if="activeStep === 1">
        <b-form-input
          v-model.trim="board.name"
          class="mb-2"
          placeholder="e.g. PS4 collection, Nintendo Switch, Xbox..."
          autofocus
          required
        />

        <b-button
          v-if="!showDescriptionField"
          size="sm"
          @click="showDescriptionField = !showDescriptionField"
        >
          Add description
        </b-button>

        <b-collapse v-model="showDescriptionField">
          <b-form-group
            label="Board description (optional)"
            label-for="description"
          >
            <b-form-textarea
              v-model="board.description"
              maxlength="280"
              rows="2"
            />
          </b-form-group>
        </b-collapse>

        <b-button
          class="d-flex ml-auto"
          :variant="board.name ? 'primary' : 'secondary'"
          :disabled="!board.name"
          v-if="activeStep < 4"
          @click="activeStep = activeStep + 1"
        >
          Next: choose platforms
        </b-button>
      </template>

      <template v-if="activeStep === 2">
        <platform-picker v-model="board.platforms" />

        <div class="d-flex justify-content-end align-items-center">
          <b-button
            variant="secondary"
            :disabled="!board.platforms.length"
            v-if="activeStep < 4"
            @click="activeStep = activeStep + 1"
          >
            Optional: choose a board template
          </b-button>

          <span class="mx-2">or</span>

          <b-button
            :variant="board.platforms.length ? 'primary' : 'secondary'"
            :disabled="!board.platforms.length"
            v-if="activeStep < 4"
            @click="createBoard"
          >
            <b-spinner small v-if="saving" />
            <span v-else>Create board</span>
          </b-button>
        </div>
      </template>

      <template v-if="activeStep === 3">
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

        <b-button
          variant="primary"
          class="d-flex ml-auto"
          @click="createBoard"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Create board</span>
        </b-button>
      </template>
    </b-modal>
  </b-button>
</template>

<script>
import PlatformPicker from '@/components/Board/PlatformPicker';
import { mapGetters } from 'vuex';

export default {
  components: {
    PlatformPicker,
  },

  data() {
    return {
      board: {
        name: '',
        description: '',
      },
      activeStep: 1,
      stepTitles: {
        1: 'Name your board',
        2: 'Game search will be limited to the platforms selected.',
        3: 'Use a board template or start from scratch',
      },
      showDescriptionField: false,
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
    ...mapGetters(['nightMode']),

    modalSubtitle() {
      return this.stepTitles[this.activeStep];
    },
  },

  methods: {
    init() {
      this.showDescriptionField = false;
      this.activeStep = 1;

      this.board = {
        name: '',
        description: '',
        theme: null,
        wallpaper: null,
        platforms: [],
        lists: [],
      };
    },

    createBoard() {
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

      return this.$store.dispatch('CREATE_BOARD', payload)
        .then(({ id }) => {
          this.saving = false;
          this.$bvToast.toast('Board crated', { title: 'Success', variant: 'success' });
          this.$bvModal.hide('create-board');
          this.$router.push({ name: 'board', params: { id } });
        })
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error creating board', { title: 'Error', variant: 'error' });
        });
    },
  },
};
</script>
