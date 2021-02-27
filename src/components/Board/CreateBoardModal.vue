<template lang="html">
  <b-modal
    id="create-board"
    :header-bg-variant="darkTheme ? 'dark' : null"
    :header-text-variant="darkTheme ? 'white' : null"
    :body-bg-variant="darkTheme ? 'dark' : null"
    :body-text-variant="darkTheme ? 'white' : null"
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
      >
        <b-button
          class="d-flex ml-auto"
          :variant="board.name ? 'primary' : 'secondary'"
          :disabled="!board.name"
          v-if="activeStep === 1"
          @click="activeStep = activeStep + 1"
        >
          Next
        </b-button>

        <b-dropdown
          v-if="board.platforms.length"
          split
          text="Next"
          variant="primary"
          @click="createBoard"
        >
          <template #button-content>
            <b-spinner small v-if="saving" />
            <span v-else>Create board</span>
          </template>

          <b-dropdown-item-button @click="activeStep = 3">
            Use board template
          </b-dropdown-item-button>
          <!-- <b-dropdown-item-button>Another action</b-dropdown-item-button> -->
          <!-- <b-dropdown-item-button>Something else here...</b-dropdown-item-button> -->
        </b-dropdown>
      </modal-header>
    </template>

    <template v-if="activeStep === 1">
      <b-form-group label="Board name:" label-for="boardName">
        <b-form-input
          id="boardName"
          v-model.trim="board.name"
          class="mb-2"
          placeholder="e.g. PS4 collection, Nintendo Switch, Xbox..."
          autofocus
          required
        />
      </b-form-group>

      <b-button
        v-if="!showDescriptionField"
        variant="link"
        class="px-0"
        size="sm"
        @click="showDescriptionField = !showDescriptionField"
      >
        Add description
      </b-button>

      <b-collapse v-model="showDescriptionField">
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
      </b-collapse>
    </template>

    <platform-picker v-if="activeStep === 2" v-model="board.platforms" />

    <b-form-group
      v-if="activeStep === 3"
      label="Board template"
    >
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
  </b-modal>
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
    ...mapGetters(['darkTheme']),

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
        backgroundUrl: null,
        backgroundColor: null,
        platforms: [],
        lists: [],
      };
    },

    createBoard() {
      const { selectedTemplate, boardTemplates, board } = this;

      if (board.platforms.length === 0) {
        return this.$bvToast.toast('Please select at least 1 platform', { variant: 'error' });
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
          this.$bvToast.toast('Board crated');
          this.$bvModal.hide('create-board');
          this.$router.push({ name: 'board', params: { id } });
        })
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error creating board', { variant: 'error' });
        });
    },
  },
};
</script>
