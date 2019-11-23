<template lang="html">
  <div>
    <modal title="Manage tags" @open="reset">
      <div class="setting">
        <i class="fas fa-tags" />
        <h5>Tags</h5>

        <button class="primary">
          Manage tags
        </button>
      </div>

      <div slot="content">
        <form class="add-tag" @submit.prevent="createTag">
          <h3>Add a tag</h3>
          <div class="tag-input">
            <input
              v-model="tagName"
              required
              maxlength="20"
              :placeholder="$t('tags.inputPlaceholder')"
              type="text"
            >

            <swatches
              v-model="tagHex"
              show-fallback
              popover-to="left"
              swatch-size="32"
              colors="basic"
            />

            <swatches
              v-model="tagTextColor"
              show-fallback
              popover-to="left"
              swatch-size="32"
              colors="basic"
            />

            <div class="preview">
              <small>Tag preview</small>
              <tag
                :label="tagName || 'Preview'"
                :hex="tagHex"
                :textHex="tagTextColor"
              />
            </div>
          </div>

          <div class="exclusive-toggle">
            Exclusive to {{ platform.name }}

            <toggle-switch
              id="global"
              v-model="exclusive"
            />
          </div>

          <div class="tag-actions">
            <button
              :disabled="!tagName"
              class="secondary"
              @click="reset"
            >
              <i class="fas fa-redo"></i>
            </button>

            <button
              :disabled="isDuplicate"
              class="primary"
              type="submit"
            >
              {{ $t('global.save') }}
            </button>
          </div>
        </form>

        <div v-if="hasTags" class="tags">
          <!-- TODO: use computed properties for filtering out tags -->
          <section>
            <h3>All tags</h3>

            <tag
              v-for="(tag, name) in localTags"
              v-if="!tag.platform"
              :key="name"
              :label="name"
              :hex="tag.hex"
              :text-hex="tag.tagTextColor"
              @close="deleteTag(name)"
            />
          </section>

          <section>
            <h3>{{ platform.name }} tags</h3>

            <tag
              v-for="(tag, name) in localTags"
              v-if="tag.platform && tag.platform === platform.id"
              :key="name"
              :label="name"
              :hex="tag.hex"
              :text-hex="tag.tagTextColor"
              @close="deleteTag(name)"
            />
          </section>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch';
import Swatches from 'vue-swatches';
import Tag from '@/components/Tag';
import Modal from '@/components/Modal';
import { mapState } from 'vuex';
import 'vue-swatches/dist/vue-swatches.min.css';

export default {
  components: {
    Tag,
    Modal,
    ToggleSwitch,
    Swatches,
  },

  data() {
    return {
      localTags: {},
      tagName: '',
      tagHex: '',
      colors: [
        ['#F64272', '#F6648B', '#F493A7', '#F891A6', '#FFCCD5' ],
        ['#8b5aff', '#a27bff', '#b99cff', '#d0bdff', '#e8deff' ],
        ['#51e5db', '#74ebe3', '#96f0ea', '#b9f5f1', '#dcfaf8' ],
        ['#ffa51a', '#ffb748', '#ffc976', '#ffdba3', '#ffedd1' ]
      ],
      tagTextColor: '#f4b41a',
      defaultColor: '#143d59',
      exclusive: false,
    };
  },

  computed: {
    ...mapState(['tags', 'platform']),

    newTag() {
      return {
        hex: this.tagHex,
        tagTextColor: this.tagTextColor,
        games: [],
      };
    },

    textColor() {
      const hexColor = this.tagHex ? this.tagHex.replace('#', 0) : '#000000';

      const r = parseInt(hexColor.substr(0, 2), 16);
      const g = parseInt(hexColor.substr(2, 2), 16);
      const b = parseInt(hexColor.substr(4, 2), 16);

      // eslint-disable-next-line
        const yiq = ((r*299)+(g*587)+(b*114))/1000;

      return yiq >= 128 ? 'dark' : 'light';
    },

    isDuplicate() {
      const tagName = this.tagName.toLowerCase();

      const lowerCaseTags = Object.keys(this.localTags).map(field => field.toLowerCase());

      return lowerCaseTags && lowerCaseTags.includes(tagName);
    },

    hasTags() {
      return Object.keys(this.localTags).length > 0;
    },
  },

  mounted() {
    this.reset();
    this.localTags = JSON.parse(JSON.stringify(this.tags));
  },

  methods: {
    updateColor(e) {
      this.tagHex = e.srcElement.value;
    },

    updateTextColor(e) {
      this.tagTextColor = e.srcElement.value;
    },

    createTag() {
      if (!this.tagHex || !this.tagName || this.isDuplicate) {
        return;
      }

      if (this.exclusive) {
        this.newTag.platform = this.platform.id;
      }

      this.$set(this.localTags, this.tagName, this.newTag);
      this.$bus.$emit('SAVE_TAGS', this.localTags);
      this.reset();
    },

    deleteTag(tagName) {
      this.$delete(this.localTags, tagName);
      this.$bus.$emit('SAVE_TAGS', this.localTags, true);
      this.reset();
    },

    reset() {
      this.tagName = '';
      this.tagHex = this.defaultColor;
      this.exclusive = false;
      this.tagTextColor = '#f4b41a',

      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~styles/styles";

  .add-tag {
    .vue-swatches__wrapper {
      width: 200px !important;
    }

    .vue-swatches__fallback__wrapper {
      width: 100%;
      margin: 0 $gp / 2 !important;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .tag-input {
    display: grid;
    grid-template-columns: 1fr 40px 40px 100px;
    grid-gap: $gp;
  }

  h3 {
    margin-bottom: $gp / 2;
  }

  input {
    margin: 0;
  }

  .tag {
    margin: 0 $gp / 2 $gp / 2 0;
  }

  .tags {
    display: grid;
    grid-gap: $gp / 2;

    h3 {
      margin-bottom: $gp / 2;
    }
  }

  .exclusive-toggle {
    display: flex;
    align-items: center;
  }

  .preview {
    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;

    small {
      font-size: 10px;
      margin-bottom: $gp / 4;
    }

    .tag {
      margin: 0;
    }
  }

  .add-tag {
    padding: $gp;
    border: 1px dashed var(--modal-text-color);
    border-radius: $gp;
    margin-bottom: $gp;
  }

  .tag-actions {
    display: flex;
    margin-top: $gp;
    justify-content: space-between;
  }
</style>
