<template lang="html">
  <b-container fluid>
    {{ $t('boards.create') }}

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


      <!-- TODO: handle boards without platforms -->
      <!-- TODO: Show loading spinner when creating -->

    <b-button
      v-if="!showOptionalFields"
      variant="link"
      class="px-0"
      size="sm"
      @click="showOptionalFields = !showOptionalFields"
    >
      Show more fields
    </b-button>

    <b-collapse v-model="showOptionalFields">
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

      <b-button v-b-modal.platformsModal>Choose platforms</b-button>

      <b-modal id="platformsModal" hide-footer>
        <template v-slot:modal-header="{ close }">
          <modal-header
            :title="$t('boards.create')"
            @close="close"
          />
        </template>

        <platform-picker v-model="board.platforms" />
      </b-modal>

      <b-form-group
        label="Board template"
      >
        <b-form-radio-group
          v-model="selectedTemplate"
          :options="boardTemplatesOptions"
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
    </b-collapse>

    <b-button @click="$router.push({ name: 'home' })">
      Cancel
    </b-button>

    <b-button
      variant="primary"
      :disabled="!board.name"
      @click="createBoard"
    >
        <b-spinner small v-if="saving" />
        <template v-else>Create board</template>
    </b-button>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      board: {
        name: '',
        description: '',
        theme: null,
        backgroundUrl: null,
        backgroundColor: null,
        platforms: [],
        lists: [],
      },
      stepTitles: {
        1: 'Name your board',
        2: 'Game search will be limited to the platforms selected.',
        3: 'Use a board template or start from scratch',
      },
      showOptionalFields: false,
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
    async createBoard() {
      this.saving = true;

      try {
        const payload = {
          ...this.board,
          lists: [{
            name: 'List name here',
            games: [],
            settings: {},
          }],
        };

        const { id } = await this.$store.dispatch('CREATE_BOARD', payload);

        this.$bvToast.toast('Board crated');
        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        this.$bvToast.toast('There was an error creating board', { variant: 'error' });
      }
    },
  },
};
</script>
