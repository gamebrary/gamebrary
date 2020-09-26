<template lang="html">
  <b-container-fluid>
    <b-jumbotron
      header="Tags"
      header-level="5"
      fluid
      lead="Tags are a great way to organize and manage your video game collection. Add, edit or delete tags."
    />

    <!-- <b-skeleton-wrapper loading>
      <template v-slot:loading>
        <b-card>
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </b-card>
      </template>

      <b-card>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas viverra nunc sapien,
        non rhoncus elit tincidunt vitae. Vestibulum maximus, ligula eu feugiat molestie,
        massa diam imperdiet odio, vitae viverra ligula est id nisi. Aliquam ut molestie est.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
        turpis egestas. Phasellus at consequat dui. Aenean tristique sagittis quam,
        sit amet sollicitudin neque sodales in.
      </b-card>
    </b-skeleton-wrapper> -->

    <b-container>
      <b-row>
        <b-col>
          <form
            ref="newTagForm"
            @submit.stop.prevent="submit"
          >
            <h6>Add new tag</h6>

            <b-row class="mb-3">
              <b-col cols="8" md="9">
                <b-form-input
                  label="test"
                  maxlength="20"
                  :placeholder="$t('tags.inputPlaceholder')"
                  required
                  v-model.trim="tagName"
                />
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
            </b-row>

            <b-row class="mb-2">
              <b-col sm="8">
                <template v-if="tagName">
                  Preview:

                  <b-badge :style="`background-color: ${hex}; color: ${tagTextColor}`">
                    {{ tagName }}
                  </b-badge>
                </template>
              </b-col>

              <b-col sm="4" class="d-flex justify-content-end">
                <b-button
                  variant="primary"
                  :disabled="isDuplicate || saving || !Boolean(tagName)"
                  @click="submit"
                >
                  <b-spinner small v-if="saving" />
                  <span v-else>Save</span>
                </b-button>
              </b-col>
            </b-row>

            <b-alert
              class="mt-3 mb-0"
              :show="isDuplicate"
              variant="warning"
            >
              You already have a tag named <strong>{{ tagName }}</strong>
            </b-alert>
          </form>
        </b-col>

        <b-col cols="8" v-if="gameTags && localTags">
          <h6>My tags</h6>

          <b-list-group>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center p-2"
              v-for="({ games, hex, tagTextColor }, name) in localTags"
              :key="name"
            >
              <b-badge
                pill
                tag="small"
                :style="`background-color: ${hex}; color: ${tagTextColor}`"
              >
                {{ name }}
              </b-badge>

              <div>
                <b-button
                  variant="primary"
                  @click="editTag(name)"
                >
                  <b-icon-pencil />
                </b-button>

                <b-button
                  variant="danger"
                  @click="deleteTag(name)"
                >
                  <b-icon-trash />
                </b-button>
              </div>
            </b-list-group-item>
          </b-list-group>

          <!-- TODO: move to component -->
          <b-modal id="editTag">
            <template v-slot:modal-title>
              Edit <strong>{{ editingOriginalTagName }}</strong> tag
            </template>

            <form
              ref="editTagForm"
              @submit.stop.prevent="saveTag"
            >
              <b-row class="mb-3" v-if="editingTag">
                <b-col sm="8">
                  <b-form-input
                    label="test"
                    maxlength="20"
                    :placeholder="$t('tags.inputPlaceholder')"
                    required
                    v-model.trim="editingTagName"
                  />
                </b-col>

                <b-col sm="4">
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
              </b-row>

              <template v-if="editingTagName">
                Preview:

                <b-badge
                  :style="`background-color: ${editingTag.hex}; color: ${editingTag.tagTextColor}`"
                >
                  {{ editingTagName }}
                </b-badge>
              </template>
            </form>

            <template v-slot:modal-footer="{ cancel }">
              <b-button @click="cancel">
                Cancel
              </b-button>

              <b-button
                variant="primary"
                :disabled="isEditedNameDuplicate || !Boolean(editingTagName) || saving"
                @click="saveTag"
              >
                <b-spinner small v-if="saving" />
                <span v-else>Save</span>
              </b-button>
            </template>

            <b-alert
              class="mt-3 mb-0"
              :show="isEditedNameDuplicate && !saving"
              variant="warning"
            >
              You already have a tag named <strong>{{ editingTagName }}</strong>
            </b-alert>
          </b-modal>
        </b-col>
      </b-row>
    </b-container>
  </b-container-fluid>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      saving: false,
      tagName: '',
      hex: '#143D59',
      tagTextColor: '#F4B41A',
      exclusive: false,
      editingTag: {},
      editingTagName: '',
      editingOriginalTagName: '',
      localTags: {},
    };
  },

  computed: {
    ...mapState(['tags', 'platform']),

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
    this.setLocalTags();
  },

  methods: {
    setLocalTags() {
      this.localTags = JSON.parse(JSON.stringify(this.tags));
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
      this.$bvToast.toast(message, { title: 'Success', variant: 'success' });
      this.reset();
      this.saving = false;
    },
  },
};
</script>
