<template lang="html">
  <b-container fluid class="create-board-page pt-3">

    <b-card class="create-board-form">
      <b-form @submit.prevent="createBoard">
        <h3>{{ $t('boards.create') }}</h3>

        <b-form-group label="Board name:" label-for="boardName">
          <b-form-input
            id="boardName"
            v-model.trim="board.name"
            placeholder="e.g. PS4 collection, Nintendo Switch, Xbox..."
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

        <!-- <b-form-group
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
        </b-form-group> -->

        <b-button
          variant="primary"
          loading
          type="submit"
        >
          <b-spinner small v-if="saving" />
          <template v-else>Create board</template>
        </b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      board: {
        name: '',
        description: '',
        lists: [],
      },
      saving: false,
      selectedTemplate: null,
      // boardTemplatesOptions: [
      //   { value: null, text: 'Blank' },
      //   { value: 'standard', text: 'Standard' },
      //   { value: 'detailed', text: 'Detailed' },
      //   { value: 'completionist', text: 'Completionist' },
      // ],
      // boardTemplates: {
      //   standard: ['Owned', 'Wishlist'],
      //   detailed: ['Physical', 'Digital', 'Wishlist'],
      //   completionist: ['Owned', 'Playing', 'Completed'],
      // },
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

        this.$router.push({ name: 'board', params: { id } });
      } catch (e) {
        this.$bvToast.toast('There was an error creating board', { variant: 'error' });
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.create-board-page {
  height: calc(100vh - 56px);
}

.create-board-form {
  max-width: 420px;
  margin: 0 auto;
}
</style>
