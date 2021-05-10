<!-- TODO: break this up into components -->
<template lang="html">
  <b-container>
    <empty-state
      v-if="showEmptyState"
      :title="$t('tags.title')"
      message="Tags are a great way to organize your collection"
     >
       <b-button
         variant="primary"
         v-b-modal.addTag
       >
         Add tag
       </b-button>
     </empty-state>

    <template v-else>
      <page-title
        title="Tags"
        action-text="Add tag"
        @action="$bvModal.show('addTag')"
      />

      <tags-list
        v-if="gameTags && localTags"
        @selected="editTag"
      />
    </template>

    <!-- TODO: move to component -->
    <b-modal
      id="editTag"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('tags.edit.title')"
          @close="close"
        >
          <b-button
            variant="danger"
            @click="promptDeleteTag(editingTagName)"
          >
            <i class="fas fa-trash-alt fa-fw" aria-hidden />
          </b-button>

          <b-button
            variant="primary"
            :disabled="isEditedNameDuplicate || !Boolean(editingTagName) || saving"
            @click="saveTag"
          >
            <b-spinner small v-if="saving" />
            <span v-else>Save</span>
          </b-button>
        </modal-header>
      </template>

      <form
        ref="editTagForm"
        @submit.stop.prevent="saveTag"
      >
        <b-form-row class="mb-3" v-if="editingTag">
          <b-col cols="8" md="9">
            <b-form-input
              label="test"
              maxlength="20"
              :placeholder="$t('tags.form.inputPlaceholder')"
              required
              v-model.trim="editingTagName"
            />
          </b-col>

          <b-col cols="4" md="3">
            <b-input-group>
              <b-form-input
                v-model="editingTag.hex"
                type="color"
                required
              />

              <b-form-input
                v-model="editingTag.tagTextColor"
                type="color"
                required
              />
            </b-input-group>
          </b-col>
        </b-form-row>

        <template v-if="editingTagName">
          Preview:

          <b-badge
            :style="`background-color: ${editingTag.hex}; color: ${editingTag.tagTextColor}`"
          >
            {{ editingTagName }}
          </b-badge>
        </template>
      </form>

      <b-alert
        class="mt-3 mb-0"
        :show="isEditedNameDuplicate && !saving"
        variant="warning"
      >
        You already have a tag named <strong>{{ editingTagName }}</strong>
      </b-alert>
    </b-modal>

    <b-modal
      id="addTag"
      hide-footer
      @show="open"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('Add tag')"
          @close="close"
        />
      </template>

      <form
        ref="newTagForm"
        @submit.stop.prevent="submit"
      >
        <b-form-row class="mb-3">
          <b-col cols="8" md="9">
            <b-form-input
              label="test"
              maxlength="20"
              :placeholder="$t('tags.form.inputPlaceholder')"
              required
              v-model.trim="tagName"
            />

            <b-form-text v-if="tagName" tag="span">
              {{ $t('tags.form.preview') }}

              <b-badge :style="`background-color: ${hex}; color: ${tagTextColor}`">
                {{ tagName }}
              </b-badge>
            </b-form-text>
          </b-col>

          <b-col cols="4" md="3">
            <b-input-group>
              <b-form-input
                v-model="hex"
                type="color"
                required
              />

              <b-form-input
                v-model="tagTextColor"
                type="color"
                required
              />
            </b-input-group>
          </b-col>
        </b-form-row>

        <b-button
          variant="primary"
          class="d-flex ml-auto"
          :disabled="isDuplicate || saving || !Boolean(tagName)"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('tags.form.addTag')}}</span>
        </b-button>

        <b-alert
          class="mt-3 mb-0"
          :show="isDuplicate"
          variant="warning"
        >
          {{ $t('tags.form.duplicateMessage', { tagName }) }}
           <strong>{{ tagName }}</strong>
        </b-alert>
      </form>
    </b-modal>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import EmptyState from '@/components/EmptyState';
import TagsList from '@/components/Tags/TagsList';

export default {
  components: {
    EmptyState,
    TagsList,
  },

  data() {
    return {
      saving: false,
      tagName: '',
      hex: '#143D59',
      tagTextColor: '#F4B41A',
      colorCombinations: [
        // [text, bg]
        ['#0d1137', '#e52165'],
        ['#ffffff', '#000000'],
        ['#101820', '#FEE715'],
        ['#F2AA4C', '#101820'],
        ['#F93822', '#FDD20E'],
      ],
      exclusive: false,
      editingTag: {},
      editingTagName: '',
      editingOriginalTagName: '',
      localTags: {},
    };
  },

  computed: {
    ...mapState(['tags', 'platform', 'games']),

    showEmptyState() {
      return Object.keys(this.tags).length === 0;
    },

    isDuplicate() {
      const { tagName, localTags } = this;

      const tagNames = Object.keys(localTags)
        .filter(name => name !== tagName)
        .map(name => name.toLowerCase());

      return tagNames.includes(tagName.toLowerCase());
    },

    isEditedNameDuplicate() {
      const { editingOriginalTagName, editingTagName, localTags } = this;

      const tagNames = Object.keys(localTags)
        .filter(name => name !== editingOriginalTagName)
        .map(tagName => tagName.toLowerCase());

      return tagNames.includes(editingTagName.toLowerCase());
    },

    gameTags() {
      return Object.keys(this.localTags).length > 0;
    },
  },

  mounted() {
    this.localTags = JSON.parse(JSON.stringify(this.tags));

    this.load();
  },

  methods: {
    async load() {
      const gamesInTags = Object.values(this.localTags)
        .map(({ games }) => games.map(gameId => String(gameId)))
        .reduce((entireList, games) => entireList.concat(games), []);

      const cachedGameList = Object.keys(this.games);
      const deDupedGameList = [...new Set(gamesInTags)];
      const gamesToLoad = deDupedGameList
        .filter(gameId => !cachedGameList.includes(gameId))
        .toString();

      if (gamesToLoad.length === 0) return;

      await this.$store.dispatch('LOAD_GAMES', gamesToLoad)
        .catch(() => {
          this.$bvToast.toast('Error loading games', { variant: 'error' });
        });
    },

    open() {
      this.setRandomColors();
    },

    setRandomColors() {
      const { colorCombinations } = this;

      const randomNumber = Math.floor(Math.random() * colorCombinations.length);

      this.tagTextColor = colorCombinations[randomNumber][0];
      this.hex = colorCombinations[randomNumber][1];
    },

    editTag(tagName) {
      this.editingTagName = tagName;
      this.editingOriginalTagName = tagName;
      this.editingTag = JSON.parse(JSON.stringify(this.localTags[tagName]));
      this.$bvModal.show('editTag');
    },

    async saveTag(e) {
      e.preventDefault();

      if (this.$refs.editTagForm.checkValidity()) {
        const { editingTagName, editingOriginalTagName, editingTag } = this;

        const renaming = editingTagName.toLowerCase() !== editingOriginalTagName.toLowerCase();

        if (renaming) {
          this.$delete(this.localTags, editingOriginalTagName);
          this.$set(this.localTags, editingTagName, editingTag);

          await this.saveTags(true);
        } else {
          this.localTags[editingOriginalTagName] = JSON.parse(JSON.stringify(editingTag));

          this.saveTags();
        }
      }
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.newTagForm.checkValidity()) {
        this.createTag();
      }
    },

    reset() {
      this.tagName = '';
      this.hex = '#143D59';
      this.tagTextColor = '#F4B41A';
    },

    createTag() {
      const { hex, tagTextColor, tagName } = this;

      const newTag = {
        games: [],
        hex,
        tagTextColor,
      };

      this.$set(this.localTags, tagName, newTag);
      this.saveTags();
    },

    promptDeleteTag(tagName) {
      this.$bvModal.msgBoxConfirm(this.$t('tags.delete.message'), {
        title: this.$t('tags.delete.title'),
        okVariant: 'danger',
        okTitle: this.$t('tags.delete.buttonLabel'),
        cancelTitle: this.$t('global.cancel'),
        headerClass: 'pb-0 border-0',
        footerClass: 'pt-0 border-0',
      })
        .then((value) => {
          if (value) {
            this.deleteTag(tagName);
          }
        });
    },

    deleteTag(tagName) {
      this.$delete(this.localTags, tagName);
      this.saveTags(true);
    },

    async saveTags(deleting) {
      this.saving = true;
      const action = deleting
        ? 'SAVE_TAGS_NO_MERGE'
        : 'SAVE_TAGS';

      await this.$store.dispatch(action, this.localTags)
        .catch(() => {
          this.saving = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      const message = deleting
        ? 'Tags saved'
        : 'Tag added';

      this.$bvModal.hide('editTag');
      this.$bvModal.hide('addTag');
      this.$bvToast.toast(message, { title: 'Success', variant: 'success' });
      this.reset();
      this.saving = false;
    },
  },
};
</script>
